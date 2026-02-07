import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Logout({ type }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (type === "student") {
      localStorage.removeItem("studentToken");
      localStorage.removeItem("studentProfile");
      navigate("/student/login");
    } else {
      localStorage.removeItem("facultyToken");
      localStorage.removeItem("facultyProfile");
      navigate("/faculty/login");
    }
    toast.success("Logged out successfully");
  };

  return (
    <div
      onClick={handleLogout}
      className="bg-amber-500 hover:bg-amber-400 p-3 rounded-lg cursor-pointer flex items-center justify-between"
    >
      <p>Logout</p>
      <img src="/logout.png" alt="student" className="size-7" />
    </div>
  );
}
