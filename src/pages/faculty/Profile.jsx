import { useLocation, Navigate } from "react-router";
import CodingProfile from "@/components/common/CodingProfile";

export default function Profile() {
  const { state: profile } = useLocation();

  if (!profile) return <Navigate to="/dashboard" replace />;

  return (
    <section className="w-full mx-auto">
      <div className="flex items-center gap-4 border-b bg-gray-800 p-4">
        <h2 className="font-bold text-3xl text-white">Student Profile</h2>
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            profile.is_placed
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
          }`}
        >
          {profile.is_placed ? "Placed" : "Not Placed"}
        </span>
      </div>

      <PersonalInfo
        student_id={profile.student_id}
        email_id={profile.email_id}
        phone_no={profile.phone_no}
        first_name={profile.first_name}
        last_name={profile.last_name}
        status={profile.status}
        last_login_at={profile.last_login_at}
      />

      <EducationalInfo
        college_name={profile.college_name}
        department_name={profile.department_name}
        passout_year={profile.passout_year}
      />

      <PlatformInfo platform_details={profile.platform_details} />

      {profile.is_placed && profile.placed_details && (
        <PlacementInfo placed_details={profile.placed_details} />
      )}

      {/* Coding Profile Component */}
      <div className="pt-4">
        <h3 className="font-bold text-xl text-white mb-4">Coding Statistics</h3>
        <CodingProfile
          leetcode={profile.platform_details?.leetcode}
          codechef={profile.platform_details?.codechef}
          geeksforgeeks={profile.platform_details?.geeksforgeeks}
          skillrack={profile.platform_details?.skillrack}
          isFaculty={true}
        />
      </div>
    </section>
  );
}

function PersonalInfo({
  first_name,
  last_name,
  status,
  last_login_at,
  email_id,
  phone_no,
  student_id,
}) {
  const renderStatus = (currentStatus) => {
    const statusMap = {
      "coding-mode": { img: "/coding.png", label: "Coding Mode" },
      "learning-dsa": { img: "/learning.png", label: "Learning DSA" },
      "building-projects": { img: "/building.png", label: "Building Projects" },
      "contest-prep": { img: "/contest.png", label: "Contest Prep" },
    };

    const active = statusMap[currentStatus];
    if (!active) return <p className="text-gray-500 italic">No status set</p>;

    return (
      <div className="border border-blue-500/50 bg-blue-500/10 rounded-lg w-2/3 mx-auto flex items-center gap-3 justify-center p-3">
        <img src={active.img} alt="status-option" className="size-8" />
        <h2 className="text-blue-400 font-medium">{active.label}</h2>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl  p-6">
      <h1 className="font-bold text-lg text-white mb-6">Personal Info</h1>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Avatar & Login */}
        <div className="space-y-3 w-full md:w-[20%] text-center border-r border-gray-700 pr-4">
          <img
            src="/avatar.png"
            alt="Avatar"
            className="size-28 mx-auto rounded-full bg-gray-700 border-4 border-gray-600"
          />
          <div className="text-gray-400 text-sm">
            <p className="font-medium text-gray-300">Last Login At:</p>
            <p>
              {last_login_at
                ? new Date(last_login_at).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Never logged in"}
            </p>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="w-full md:w-1/3">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
            <div>
              <p className="text-gray-500">First Name</p>
              <p className="font-medium text-gray-200 text-lg">{first_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Name</p>
              <p className="font-medium text-gray-200 text-lg">{last_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Student ID</p>
              <p className="font-medium text-blue-400">{student_id}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-200">{phone_no}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-200 break-all">{email_id}</p>
            </div>
          </div>
        </div>

        {/* Status Area */}
        <div className="text-center w-full md:w-1/3 border-l border-gray-700 pl-4">
          <h1 className="font-semibold text-gray-300 mb-4">Current Status</h1>
          {renderStatus(status)}
        </div>
      </div>
    </div>
  );
}

function EducationalInfo({ college_name, department_name, passout_year }) {
  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl  p-6">
      <h1 className="font-bold text-lg text-white mb-6">Educational Info</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-750 flex flex-col items-center justify-center space-y-3">
          <img
            src="/college.png"
            alt="College"
            className="w-12 h-12 opacity-80"
          />
          <div>
            <h2 className="text-gray-500 text-sm">College Name</h2>
            <h1 className="font-medium text-gray-200">{college_name}</h1>
          </div>
        </div>

        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-750 flex flex-col items-center justify-center space-y-3">
          <img
            src="/department.png"
            alt="Department"
            className="w-12 h-12 opacity-80"
          />
          <div>
            <h2 className="text-gray-500 text-sm">Department Name</h2>
            <h1 className="font-medium text-gray-200">{department_name}</h1>
          </div>
        </div>

        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-750 flex flex-col items-center justify-center space-y-3">
          <img
            src="/passout.png"
            alt="Passout"
            className="w-12 h-12 opacity-80"
          />
          <div>
            <h2 className="text-gray-500 text-sm">Passout Year</h2>
            <h1 className="font-medium text-blue-400 text-lg">
              {passout_year}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformInfo({ platform_details }) {
  const platforms = [
    {
      name: "LeetCode",
      key: "leetcode",
      urlBase: "https://leetcode.com/u/",
      img: "/leetcode.png",
    },
    {
      name: "CodeChef",
      key: "codechef",
      urlBase: "https://codechef.com/users/",
      img: "/codechef.png",
    },
    {
      name: "GeeksforGeeks",
      key: "geeksforgeeks",
      urlBase: "https://geeksforgeeks.org/user/",
      img: "/geeksforgeeks.png",
    },
    { name: "SkillRack", key: "skillrack", urlBase: "", img: "/skillrack.png" }, // Skillrack has full URL in data
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl  p-6">
      <h1 className="font-bold text-lg text-white mb-6">Platform Links</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((plat) => {
          const handle = platform_details?.[plat.key];
          const href =
            plat.key === "skillrack" ? handle : `${plat.urlBase}${handle}`;

          return (
            <div
              key={plat.name}
              className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-750 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={plat.img}
                  alt={plat.name}
                  className="w-10 h-10 object-contain rounded"
                />
                <div>
                  <h3 className="text-gray-300 font-medium">{plat.name}</h3>
                  <p className="text-sm text-gray-500 max-w-56 overflow-x-clip">
                    {handle ? handle : "Not Linked"}
                  </p>
                </div>
              </div>

              {handle ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded hover:bg-blue-500/20 transition-colors"
                >
                  View Profile
                </a>
              ) : (
                <span className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-800 border border-gray-700 rounded cursor-not-allowed">
                  No Link
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlacementInfo({ placed_details }) {
  return (
    <div className="bg-gray-800 border border-gray-700 shadow-xl  p-6">
      <h1 className="font-bold text-lg text-green-400 mb-6 flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Placement Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-750">
          <p className="text-gray-500 text-sm mb-1">Company Name</p>
          <p className="font-medium text-gray-200 text-lg">
            {placed_details.company_name || "N/A"}
          </p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-750">
          <p className="text-gray-500 text-sm mb-1">Role</p>
          <p className="font-medium text-gray-200 text-lg">
            {placed_details.role_name || "N/A"}
          </p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-750">
          <p className="text-gray-500 text-sm mb-1">Company Type</p>
          <p className="font-medium text-gray-200 text-lg capitalize">
            {placed_details.company_type || "N/A"}
          </p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-green-500/20">
          <p className="text-green-500/70 text-sm mb-1">Compensation</p>
          <p className="font-bold text-green-400 text-lg">
            {placed_details.annual_compensation || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
