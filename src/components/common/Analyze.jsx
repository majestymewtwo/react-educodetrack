import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

export default function Analyze({ platform, payload, isFaculty, token }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [insight, setInsight] = useState({
    data: "",
    loaded: false,
  });

  const [displayText, setDisplayText] = useState("");
  const typingIntervalRef = useRef(null); // store interval

  const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

  const analyzeInsights = async () => {
    if (insight.loaded) return;

    setLoading(true);

    const startTime = Date.now(); // track start

    const URL = isFaculty
      ? `${SERVER_URL}/api/faculty/analyze-student`
      : `${SERVER_URL}/api/student/analyze-myself`;

    try {
      const res = await axios.get(
        `${URL}?platform=${platform}&payload=${payload}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const text = res.data?.insight || "";

      // Ensure minimum 4 seconds loading
      const elapsed = Date.now() - startTime;
      const remaining = 4000 - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      setInsight({
        data: text,
        loaded: true,
      });

      startTypingEffect(text);
    } catch (err) {
      toast.error("An error occured");
      console.error(err);
    }

    setLoading(false);
  };

  const startTypingEffect = (text) => {
    if (!text) return;

    // clear previous typing
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    let index = -1;
    setDisplayText("");

    typingIntervalRef.current = setInterval(() => {
      setDisplayText((prev) => prev + text[index]);
      index++;

      if (index >= text.length) {
        clearInterval(typingIntervalRef.current);
      }
    }, 25);
  };

  // Handle modal open / close behavior
  useEffect(() => {
    if (isOpen) {
      if (!insight.loaded) {
        analyzeInsights();
      } else {
        // restart typing using cached insight
        startTypingEffect(insight.data);
      }
    } else {
      // stop typing when modal closes
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    }
  }, [isOpen]);

  return (
    <section>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-gray-600 flex items-center gap-4 text-lg border border-slate-300 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100"
      >
        <img src="/ai.png" alt="ai" className="size-6" />
        Generate Insights
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsOpen(false)}
          />

          <div className="insight-modal relative bg-gray-900 text-white rounded-xl p-6 w-1/2 shadow-lg h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                AI Performance Analysis - {platform}
              </h2>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap h-full">
              {loading ? (
                <div className="animate-pulse text-green-400 flex items-center justify-center h-full">
                  <img src="/wave-loading.gif" alt="loading" className="w-40" />
                </div>
              ) : (
                displayText
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
