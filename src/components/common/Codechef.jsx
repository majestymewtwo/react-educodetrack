import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "./Loader";

export default function Codechef({ isVisible, username, token }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/track/codechef/${username}`,
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

  if (loading && isVisible) return <Loader />;

  return (
    <div className={`${isVisible ? "block" : "hidden"} space-y-6 text-white`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">CodeChef Performance</h1>
        <div className="text-gray-400 text-sm">{data?.country}</div>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold">{data?.name}</h2>
        <p className="text-gray-400 text-sm mt-1">{data?.institution}</p>
      </div>

      {/* Rating + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Rating Card */}
        <div className="bg-gray-900 rounded-xl p-6 flex flex-col items-center justify-center">
          <div className="text-sm text-gray-400">Current Rating</div>
          <div className="text-3xl font-bold mt-2 text-yellow-400">
            {data?.current_rating?.split("\n")[0]}
          </div>

          <div className="text-sm text-gray-400 mt-2">
            Highest Rating: {data?.highest_rating}
          </div>

          <div className="text-2xl mt-2">{data?.stars}</div>
        </div>

        {/* Contest Stats */}
        <div className="bg-gray-900 rounded-xl p-6 space-y-2">
          <h2 className="font-semibold mb-2">Contest Stats</h2>

          <div className="flex justify-between">
            <span>Contests Participated</span>
            <span>{data?.contests_participated}</span>
          </div>

          <div className="flex justify-between">
            <span>Problems Solved</span>
            <span>{data?.total_problems_solved}</span>
          </div>
        </div>

        {/* Rank Info */}
        <div className="bg-gray-900 rounded-xl p-6 space-y-2">
          <h2 className="font-semibold mb-2">Ranking</h2>

          <div className="flex justify-between">
            <span>Global Rank</span>
            <span>{data?.global_rank}</span>
          </div>

          <div className="flex justify-between">
            <span>Country Rank</span>
            <span>{data?.country_rank}</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Badges</h2>

        {data?.badges?.length === 0 && (
          <p className="text-gray-400 text-sm">No badges earned yet.</p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {data?.badges?.map((badge, i) => (
            <div
              key={i}
              className="border border-gray-800 rounded-lg p-4"
            >
              <div className="font-semibold">{badge.title}</div>
              <div className="text-sm text-gray-400 mt-1">
                {badge.description}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
