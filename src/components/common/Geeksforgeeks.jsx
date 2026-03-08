import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "./Loader";
import Analyze from "./Analyze";

export default function Geeksforgeeks({ isVisible, username, token, isFaculty }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/track/geeksforgeeks/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setData(res.data);
    } catch (err) {
      toast.error("An error occured");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const result = data?.problems?.result || {};

  const basicProblems = result.Basic ? Object.values(result.Basic) : [];
  const easyProblems = result.Easy ? Object.values(result.Easy) : [];
  const mediumProblems = result.Medium ? Object.values(result.Medium) : [];
  const hardProblems = result.Hard ? Object.values(result.Hard) : [];

  const basicCount = basicProblems.length;
  const easyCount = easyProblems.length;
  const mediumCount = mediumProblems.length;
  const hardCount = hardProblems.length;
  const totalSolved = basicCount + easyCount + mediumCount + hardCount;

  const submissionMap = data?.submission?.result || {};

  // Generate last 120 days
  const heatmapDays = [];
  for (let i = 119; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    heatmapDays.push({
      date: key,
      count: submissionMap[key] || 0,
    });
  }

  // Color function
  const getHeatColor = (count) => {
    if (count === 0) return "bg-gray-800";
    if (count <= 1) return "bg-green-900";
    if (count <= 2) return "bg-green-700";
    if (count <= 4) return "bg-green-500";
    return "bg-green-400";
  };

  if (loading && isVisible) return <Loader />;

  return (
    <div className={`${isVisible ? "block" : "hidden"} space-y-6 text-white`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">
          GeeksforGeeks performance
        </h1>
        <Analyze
          payload={username}
          platform={"geeksforgeeks"}
          isFaculty={isFaculty}
          token={token}
        />
      </div>

      {/* Solved Circle */}
      <div className="bg-gray-900 rounded-xl p-6 flex items-center gap-8">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>

          <div
            className="absolute inset-0 rounded-full border-8 border-green-500"
            style={{
              clipPath: `inset(${100 - (totalSolved / 500) * 100}% 0 0 0)`,
            }}
          ></div>

          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
            {totalSolved}
          </div>
        </div>

        <div>
          <p className="text-gray-400">Problems Solved</p>
          <p className="text-lg font-semibold">{totalSolved}</p>
        </div>
      </div>

      {/* Difficulty Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-blue-400 font-semibold">Basic</h2>
          <p className="text-2xl font-bold mt-2">{basicCount}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-green-400 font-semibold">Easy</h2>
          <p className="text-2xl font-bold mt-2">{easyCount}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-yellow-400 font-semibold">Medium</h2>
          <p className="text-2xl font-bold mt-2">{mediumCount}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-red-400 font-semibold">Hard</h2>
          <p className="text-2xl font-bold mt-2">{hardCount}</p>
        </div>
      </div>

      {/* Difficulty Distribution Bar */}
      <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden flex">
        {totalSolved > 0 && (
          <>
            <div
              className="bg-blue-500"
              style={{ width: `${(basicCount / totalSolved) * 100}%` }}
            />
            <div
              className="bg-green-500"
              style={{ width: `${(easyCount / totalSolved) * 100}%` }}
            />
            <div
              className="bg-yellow-500"
              style={{ width: `${(mediumCount / totalSolved) * 100}%` }}
            />
            <div
              className="bg-red-500"
              style={{ width: `${(hardCount / totalSolved) * 100}%` }}
            />
          </>
        )}
      </div>

      {/* Heatmap */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Submission Heatmap</h2>

        <div className="grid grid-cols-20 gap-1">
          {heatmapDays.map((day, idx) => (
            <div
              key={idx}
              title={`${day.date} : ${day.count} submissions`}
              className={`w-3 h-3 rounded-sm ${getHeatColor(day.count)}`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
          <span>Less</span>
          <div className="w-3 h-3 bg-gray-800 rounded-sm" />
          <div className="w-3 h-3 bg-green-900 rounded-sm" />
          <div className="w-3 h-3 bg-green-700 rounded-sm" />
          <div className="w-3 h-3 bg-green-500 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 rounded-sm" />
          <span>More</span>
        </div>
      </div>

      {/* Problem Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic */}
        <div className="bg-gray-900 rounded-xl p-4 max-h-96 overflow-y-auto">
          <h2 className="text-blue-400 font-semibold mb-3">Basic Problems</h2>
          {basicProblems.map((p, i) => (
            <div key={i} className="text-sm py-1 border-b border-gray-800">
              {p.pname}
            </div>
          ))}
        </div>

        {/* Easy */}
        <div className="bg-gray-900 rounded-xl p-4 max-h-96 overflow-y-auto">
          <h2 className="text-green-400 font-semibold mb-3">Easy Problems</h2>
          {easyProblems.map((p, i) => (
            <div key={i} className="text-sm py-1 border-b border-gray-800">
              {p.pname}
            </div>
          ))}
        </div>

        {/* Medium */}
        <div className="bg-gray-900 rounded-xl p-4 max-h-96 overflow-y-auto">
          <h2 className="text-yellow-400 font-semibold mb-3">
            Medium Problems
          </h2>
          {mediumProblems.map((p, i) => (
            <div key={i} className="text-sm py-1 border-b border-gray-800">
              {p.pname}
            </div>
          ))}
        </div>

        {/* Hard */}
        <div className="bg-gray-900 rounded-xl p-4 max-h-96 overflow-y-auto">
          <h2 className="text-red-400 font-semibold mb-3">Hard Problems</h2>
          {hardProblems.map((p, i) => (
            <div key={i} className="text-sm py-1 border-b border-gray-800">
              {p.pname}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
