import { Navigate } from "react-router";

export default function ProtectedRoute({ type, children }) {
  const tokenName = type === "student" ? "studentToken" : "facultyToken";
  const authToken = localStorage.getItem(tokenName);

  return authToken ? (
    <section className="p-4 bg-slate-200 w-[80%] h-screen overflow-y-scroll">{children}</section>
  ) : (
    <Navigate to={type === "student" ? "/student" : "/faculty"} />
  );
}
