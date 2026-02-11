import CodingProfile from "@/components/common/CodingProfile";
import Loader from "@/components/common/Loader";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();
  const token = localStorage.getItem("studentToken");

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
      setProfile(data.platform_details);
      setLoading(false);
    } catch (err) {
      toast.error("An error occured");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if(loading)
    return <Loader />

  return (
    <section>
      <CodingProfile 
        leetcode={profile.leetcode}
        codechef={profile.codechef}
        geeksforgeeks={profile.geeksforgeeks}
        skillrack={profile.skillrack}
      />
    </section>
  );
}
