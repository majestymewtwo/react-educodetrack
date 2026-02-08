import Loader from "@/components/common/Loader";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();
  const token = localStorage.getItem("studentToken");

  const handleStatusUpdate = (status) => {
    updateProfile({
      ...profile,
      status,
    });
  };

  const handlePlatformUpdate = (platform_details) => {
    updateProfile({
      ...profile,
      platform_details: {
        ...profile.platform_details,
        ...platform_details,
      },
    });
  };

  const handlePlacementUpdate = (placed_details) => {
    console.log(placed_details);
    updateProfile({
      ...profile,
      placed_details: {
        ...placed_details,
      },
    });
  };

  const updateProfile = async (data) => {
    const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;
    try {
      await axios.put(`${SERVER_URL}/api/student/update-details`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Updated profile");
      fetchProfile();
    } catch (err) {
      toast.error("An error occured");
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;
    try {
      const res = await axios.get(`${SERVER_URL}/api/student/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      console.log(data);
      setProfile(data);
      setLoading(false);
    } catch (err) {
      toast.error("An error occured");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="space-y-5">
      <h2 className="font-semibold text-3xl">Student Profile</h2>
      <PersonalInfo
        student_id={profile.student_id}
        email_id={profile.email_id}
        phone_no={profile.phone_no}
        first_name={profile.first_name}
        last_name={profile.last_name}
        status={profile.status}
        last_login_at={profile.last_login_at}
        handleStatusUpdate={handleStatusUpdate}
      />
      <EducationalInfo
        college_name={profile.college_name}
        department_name={profile.department_name}
        passout_year={profile.passout_year}
      />
      <PlatformInfo
        platform_details={profile.platform_details}
        handlePlatformUpdate={handlePlatformUpdate}
      />
      {profile.is_placed && (
        <PlacementInfo
          placed_details={profile.placed_details}
          handlePlacementUpdate={handlePlacementUpdate}
        />
      )}
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
  handleStatusUpdate,
}) {
  return (
    <div className="bg-white border border-slate-300 shadow-lg rounded-md p-4">
      <h1 className="font-bold text-lg text-amber-600">Personal Info</h1>
      <div className="flex items-center justify-between p-4">
        <div className="space-y-2 w-[20%]">
          <img src="/avatar.png" alt="Avatar" className="size-32 mx-auto" />
          <div className="text-slate-600 text-center">
            <p>Last Login At:</p>
            <p>
              {new Date(last_login_at).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "medium",
              })}
            </p>
          </div>
        </div>
        <div className="w-1/3 p-4">
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <p className="text-gray-500 text-sm">First Name</p>
              <p className="font-medium">{first_name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Last Name</p>
              <p className="font-medium">{last_name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Student ID</p>
              <p className="font-medium">{student_id}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-medium">{phone_no}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium break-all">{email_id}</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-1 w-1/3 select-none">
          <h1 className="font-semibold text-lg mb-3">Status</h1>
          <div
            className={`${status === "coding-mode" ? "border-2 border-amber-500" : "border border-slate-200"} rounded-md w-2/3 mx-auto flex items-center gap-2 justify-between p-2 cursor-pointer`}
            onClick={() => handleStatusUpdate("coding-mode")}
          >
            <img src="/coding.png" alt="status-option" className="size-10" />
            <h2>Coding Mode</h2>
          </div>
          <div
            className={`${status === "learning-dsa" ? "border-2 border-amber-500" : "border border-slate-200"} rounded-md w-2/3 mx-auto flex items-center gap-2 justify-between p-2 cursor-pointer`}
            onClick={() => handleStatusUpdate("learning-dsa")}
          >
            <img src="/learning.png" alt="status-option" className="size-10" />
            <h2>Learning DSA</h2>
          </div>
          <div
            className={`${status === "building-projects" ? "border-2 border-amber-500" : "border border-slate-200"} rounded-md w-2/3 mx-auto flex items-center gap-2 justify-between p-2 cursor-pointer`}
            onClick={() => handleStatusUpdate("building-projects")}
          >
            <img src="/building.png" alt="status-option" className="size-10" />
            <h2>Building Projects</h2>
          </div>
          <div
            className={`${status === "contest-prep" ? "border-2 border-amber-500" : "border border-slate-200"} rounded-md w-2/3 mx-auto flex items-center gap-2 justify-between p-2 cursor-pointer`}
            onClick={() => handleStatusUpdate("contest-prep")}
          >
            <img src="/contest.png" alt="status-option" className="size-10" />
            <h2>Contest Prep</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationalInfo({ college_name, department_name, passout_year }) {
  return (
    <div className="bg-white border border-slate-300 shadow-lg rounded-md p-4">
      <h1 className="font-bold text-lg text-amber-600">Educational Info</h1>
      <div className="grid grid-cols-3 gap-5 text-center text-lg">
        <div className="p-4 space-y-4">
          <img src="/college.png" alt="College" className="w-1/3 mx-auto" />
          <div>
            <h2 className="font-semibold">College Name</h2>
            <h1>{college_name}</h1>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <img src="/department.png" alt="College" className="w-1/3 mx-auto" />
          <div>
            <h2 className="font-semibold">Department Name</h2>
            <h1>{department_name}</h1>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <img src="/passout.png" alt="College" className="w-1/3 mx-auto" />
          <div>
            <h2 className="font-semibold">Passout Year</h2>
            <h1>{passout_year}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlatformInfo({ platform_details, handlePlatformUpdate }) {
  const leetcodeRef = useRef();
  const codechefRef = useRef();
  const geeksforgeeksRef = useRef();
  const skillrackRef = useRef();

  useEffect(() => {
    if (platform_details && platform_details.leetcode)
      leetcodeRef.current.value = platform_details.leetcode;
    if (platform_details && platform_details.codechef)
      codechefRef.current.value = platform_details.codechef;
    if (platform_details && platform_details.geeksforgeeks)
      geeksforgeeksRef.current.value = platform_details.geeksforgeeks;
    if (platform_details && platform_details.skillrack)
      skillrackRef.current.value = platform_details.skillrack;
  }, []);

  return (
    <div className="bg-white border border-slate-300 shadow-lg rounded-md p-4">
      <h1 className="font-bold text-lg text-amber-600">Platform Info</h1>
      <div className="grid grid-cols-3 gap-3 p-4 items-center">
        {/* Leetcode */}
        <div className="flex gap-2 items-center p-4 justify-between col-span-3">
          <img src="/leetcode.png" alt="leetcode" className="w-1/4" />
          <div className="flex items-center gap-1 text-sm w-2/3">
            <input
              ref={leetcodeRef}
              type="text"
              placeholder="Leetcode username"
              className="p-2 border border-slate-400 rounded-md w-full focus:outline-amber-500"
            />
            <div className="flex items-center gap-2">
              {platform_details && platform_details.leetcode && (
                <a
                  href={`https://leetcode.com/u/${platform_details.leetcode}`}
                  target="_blank"
                  className="p-2 border-2 border-amber-400 rounded-md w-30 hover:bg-slate-100 cursor-pointer"
                >
                  View Profile
                </a>
              )}
              <button
                onClick={() => {
                  handlePlatformUpdate({
                    leetcode: leetcodeRef.current.value,
                  });
                }}
                className="p-2 border border-slate-400 rounded-md w-20 bg-amber-400 hover:outline-amber-500 cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Codechef */}
        <div className="flex gap-2 items-center p-4 justify-between col-span-3">
          <img src="/codechef.png" alt="codechef" className="w-1/4" />
          <div className="flex items-center gap-1 text-sm w-2/3">
            <input
              ref={codechefRef}
              type="text"
              placeholder="Codechef username"
              className="p-2 border border-slate-400 rounded-md w-full focus:outline-amber-500"
            />
            <div className="flex items-center gap-2">
              {platform_details && platform_details.codechef && (
                <a
                  href={`https://codechef.com/users/${platform_details.codechef}`}
                  target="_blank"
                  className="p-2 border-2 border-amber-400 rounded-md w-30 hover:bg-slate-100 cursor-pointer"
                >
                  View Profile
                </a>
              )}
              <button
                onClick={() => {
                  handlePlatformUpdate({
                    codechef: codechefRef.current.value,
                  });
                }}
                className="p-2 border border-slate-400 rounded-md w-20 bg-amber-400 hover:outline-amber-500 cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* GeeksForGeeks */}
        <div className="flex gap-2 items-center p-4 justify-between col-span-3">
          <img src="/geeksforgeeks.png" alt="geeksforgeeks" className="w-1/4" />
          <div className="flex items-center gap-1 text-sm w-2/3">
            <input
              ref={geeksforgeeksRef}
              type="text"
              placeholder="GeeksforGeeks username"
              className="p-2 border border-slate-400 rounded-md w-full focus:outline-amber-500"
            />
            <div className="flex items-center gap-2">
              {platform_details && platform_details.geeksforgeeks && (
                <a
                  href={`https://geeksforgeeks.org/user/${platform_details.geeksforgeeks}`}
                  target="_blank"
                  className="p-2 border-2 border-amber-400 rounded-md w-30 hover:bg-slate-100 cursor-pointer"
                >
                  View Profile
                </a>
              )}
              <button
                onClick={() => {
                  handlePlatformUpdate({
                    geeksforgeeks: geeksforgeeksRef.current.value,
                  });
                }}
                className="p-2 border border-slate-400 rounded-md w-20 bg-amber-400 hover:outline-amber-500 cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* SkillRack */}
        <div className="flex gap-2 items-center p-4 justify-between col-span-3">
          <img src="/skillrack.png" alt="skillrack" className="w-1/4" />
          <div className="flex items-center gap-1 text-sm w-2/3">
            <input
              ref={skillrackRef}
              type="text"
              placeholder="Skillrack Profile"
              className="p-2 border border-slate-400 rounded-md w-full focus:outline-amber-500"
            />
            <div className="flex items-center gap-2">
              {platform_details && platform_details.skillrack && (
                <a
                  href={`${platform_details.skillrack}`}
                  target="_blank"
                  className="p-2 border-2 border-amber-400 rounded-md w-30 hover:bg-slate-100 cursor-pointer"
                >
                  View Profile
                </a>
              )}
              <button
                onClick={() => {
                  handlePlatformUpdate({
                    skillrack: skillrackRef.current.value,
                  });
                }}
                className="p-2 border border-slate-400 rounded-md w-20 bg-amber-400 hover:outline-amber-500 cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlacementInfo({ placed_details, handlePlacementUpdate }) {
  const [formData, setFormData] = useState({
    company_name: "",
    role_name: "",
    company_type: "",
    annual_compensation: "",
  });

  useEffect(() => {
    if (placed_details) {
      console.log(placed_details);
      setFormData({
        company_name: placed_details.company_name || "",
        role_name: placed_details.role_name || "",
        company_type: placed_details.company_type || "",
        annual_compensation: placed_details.annual_compensation || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    handlePlacementUpdate(formData);
  };

  return (
    <div className="bg-white border border-slate-300 shadow-lg rounded-md p-4">
      <h1 className="font-bold text-lg text-amber-600 mb-4">Placement Info</h1>

      {/* Company Name */}
      <div className="flex flex-col gap-1 mb-3">
        <label className="text-sm font-medium">Company Name</label>
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          className="p-2 border border-slate-400 rounded-md focus:outline-amber-500"
          placeholder="Enter company name"
        />
      </div>

      {/* Role Name */}
      <div className="flex flex-col gap-1 mb-3">
        <label className="text-sm font-medium">Role Name</label>
        <input
          type="text"
          name="role_name"
          value={formData.role_name}
          onChange={handleChange}
          className="p-2 border border-slate-400 rounded-md focus:outline-amber-500"
          placeholder="Enter role name"
        />
      </div>

      {/* Company Type */}
      <div className="flex flex-col gap-1 mb-3">
        <label className="text-sm font-medium">Company Type</label>
        <select
          name="company_type"
          value={formData.company_type}
          onChange={handleChange}
          className="p-2 border border-slate-400 rounded-md focus:outline-amber-500"
        >
          <option value="">Select type</option>
          <option value="product-based">Product-based</option>
          <option value="service-based">Service-based</option>
        </select>
      </div>

      {/* Annual Compensation */}
      <div className="flex flex-col gap-1 mb-4">
        <label className="text-sm font-medium">Annual Compensation</label>
        <select
          name="annual_compensation"
          value={formData.annual_compensation}
          onChange={handleChange}
          className="p-2 border border-slate-400 rounded-md focus:outline-amber-500"
        >
          <option value="">Select package</option>
          <option value="3 - 5 lakhs">3 - 5 lakhs</option>
          <option value="6 - 8 lakhs">6 - 8 lakhs</option>
          <option value="9 - 12 lakhs">9 - 12 lakhs</option>
          <option value="13 - 15 lakhs">13 - 15 lakhs</option>
          <option value="15 - 20 lakhs">15 - 20 lakhs</option>
          <option value="20 lakhs +">20 lakhs +</option>
        </select>
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className="p-2 border border-slate-400 rounded-md bg-amber-400 hover:outline-amber-500 cursor-pointer w-full"
      >
        Update
      </button>
    </div>
  );
}
