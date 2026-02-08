import Loader from "@/components/common/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
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

  const updateProfile = async (data) => {
    const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;
    try {
      await axios.put(`${SERVER_URL}/api/student/update-details`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      <PlatformInfo />
      <PlacementInfo />
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

function PlatformInfo({ platform_details }) {
  return (
    <div className="bg-white border border-slate-300 shadow-lg rounded-md p-4">
      <h1 className="font-bold text-lg text-amber-600">Platform Info</h1>
    </div>
  );
}

function PlacementInfo({ placed_details }) {
  return (
    <div className="bg-white border border-slate-300 shadow-lg rounded-md p-4">
      <h1 className="font-bold text-lg text-amber-600">Placement Info</h1>
    </div>
  );
}
