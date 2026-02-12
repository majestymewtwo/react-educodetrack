import { useEffect, useState } from "react";
import Loader from "./Loader";
import { toast } from "react-toastify";
import axios from "axios";

export default function Leetcode({ isVisible, username, token }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/track/leetcode/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // ---------- Helpers ----------
  const getStreak = () => {
    if (!data?.submissionCalendar) return 0;

    const days = Object.keys(data.submissionCalendar)
      .map(Number)
      .sort((a, b) => b - a);

    let streak = 0;
    let prevDay = null;

    for (let day of days) {
      if (!prevDay) {
        streak++;
        prevDay = day;
        continue;
      }
      if (prevDay - day === 86400) {
        streak++;
        prevDay = day;
      } else break;
    }
    return streak;
  };

  const generateHeatmap = () => {
    if (!data?.submissionCalendar) return [];

    const entries = Object.entries(data.submissionCalendar)
      .map(([ts, count]) => ({ date: new Date(Number(ts) * 1000), count }))
      .sort((a, b) => a.date - b.date);

    return entries.slice(-120); // last ~4 months for compact view
  };

  const heatmapData = generateHeatmap();

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const totalSolved = data?.totalSolved || 0;
  const totalQuestions = data?.totalQuestions || 1;
  const progress = totalSolved / totalQuestions;
  const strokeDashoffset = circumference * (1 - progress);

  if (loading && isVisible) return <Loader />;

  return (
    <div className={`${isVisible ? "block" : "hidden"} space-y-6 text-white`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">LeetCode Performance</h1>
        <div className="text-sm text-gray-400">Ranking: {data?.ranking}</div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Circular Progress */}
        <div className="bg-gray-900  rounded-xl p-6 flex flex-col items-center">
          <svg width="160" height="160">
            <circle
              stroke="#2d3748"
              fill="transparent"
              strokeWidth="10"
              r={radius}
              cx="80"
              cy="80"
            />
            <circle
              stroke="#facc15"
              fill="transparent"
              strokeWidth="10"
              r={radius}
              cx="80"
              cy="80"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div className="mt-3 text-lg font-semibold">
            {totalSolved} / {totalQuestions}
          </div>
          <div className="text-sm text-gray-400">Problems Solved</div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-gray-900 rounded-xl p-6 space-y-2">
          <h2 className="font-semibold mb-2">Difficulty Breakdown</h2>

          <div className="flex justify-between text-green-400">
            <span>Easy</span>
            <span>{data?.easySolved}/{data?.totalEasy}</span>
          </div>

          <div className="flex justify-between text-yellow-400">
            <span>Medium</span>
            <span>{data?.mediumSolved}/{data?.totalMedium}</span>
          </div>

          <div className="flex justify-between text-red-400">
            <span>Hard</span>
            <span>{data?.hardSolved}/{data?.totalHard}</span>
          </div>
        </div>

        {/* Streak + Contribution */}
        <div className="bg-gray-900 rounded-xl p-6 space-y-2">
          <h2 className="font-semibold mb-2">Activity</h2>
          <div>🔥 Current Streak: {getStreak()} days</div>
          <div>⭐ Contribution: {data?.contributionPoint}</div>
          <div>🏆 Reputation: {data?.reputation}</div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Submission Heatmap</h2>

        <div className="grid grid-cols-20 gap-1">
          {heatmapData.map((day, i) => {
            let intensity =
              day.count > 8
                ? "bg-green-500"
                : day.count > 4
                ? "bg-green-400"
                : day.count > 0
                ? "bg-green-700"
                : "bg-gray-800";

            return (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${intensity}`}
                title={`${day.date.toDateString()} : ${day.count} submissions`}
              />
            );
          })}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Recent Submissions</h2>

        <div className="space-y-2">
          {data?.recentSubmissions?.slice(0, 10).map((sub, i) => (
            <div
              key={i}
              className="flex justify-between text-sm border-b border-gray-800 pb-1"
            >
              <span>{sub.title}</span>
              <span
                className={
                  sub.statusDisplay === "Accepted"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {sub.statusDisplay}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
