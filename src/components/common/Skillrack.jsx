import { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import { toast } from "react-toastify";
import Analyze from "./Analyze";

export default function Skillrack({ isVisible, url, token, isFaculty }) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

  const fetchProfile = async () => {
    if (url) {
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/track/skillrack?profileurl=${url}`,
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
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const stats = data?.stats || {};
  const certificates = data?.certificates || [];

  if (loading && isVisible) return <Loader />;

  if (isVisible && !url) return <h1>No Data Available</h1>;

  return (
    <div className={`${isVisible ? "block" : "hidden"} space-y-6 text-white`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black">
          SkillRack Performance
        </h1>
        <Analyze
          payload={url}
          platform={"skillrack"}
          isFaculty={isFaculty}
          token={token}
        />
      </div>

      {/* Programs Solved Highlight */}
      <div className="bg-gray-900 rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">Programs Solved</p>
          <p className="text-3xl font-bold">{stats["PROGRAMS SOLVED"] || 0}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Level</p>
          <p className="text-lg font-semibold">{stats.LEVEL || "-"}</p>
        </div>
      </div>

      {/* Medal Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <p className="text-yellow-400 font-semibold">Gold</p>
          <p className="text-2xl font-bold">{stats.GOLD || 0}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <p className="text-gray-300 font-semibold">Silver</p>
          <p className="text-2xl font-bold">{stats.SILVER || 0}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <p className="text-orange-400 font-semibold">Bronze</p>
          <p className="text-2xl font-bold">{stats.BRONZE || 0}</p>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Code Track</p>
          <p className="font-semibold">{stats["CODE TRACK"] || 0}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Code Test</p>
          <p className="font-semibold">{stats["CODE TEST"] || 0}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Daily Challenge</p>
          <p className="font-semibold">{stats.DC || 0}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Daily Test</p>
          <p className="font-semibold">{stats.DT || 0}</p>
        </div>
      </div>

      {/* Language Stats */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="font-semibold mb-4">Languages Used</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["C", "Java", "CPP23", "Python3", "SQL", "JDBC", "HTML"].map(
            (lang) => (
              <div
                key={lang}
                className="bg-gray-800 rounded-lg p-3 text-center"
              >
                <p className="text-gray-400 text-sm">{lang}</p>
                <p className="font-semibold">{stats[lang] || 0}</p>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Certificates */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="font-semibold mb-4">
          Certificates ({data?.total_certificates_count || 0})
        </h2>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {certificates.map((cert, index) => (
            <a
              key={index}
              href={cert.link}
              target="_blank"
              rel="noreferrer"
              className="block bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition"
            >
              <p className="font-medium">{cert.title}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
