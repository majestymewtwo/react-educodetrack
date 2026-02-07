import ProtectedRoute from "../common/ProtectedRoute";
import SideBar from "./SideBar";

export default function StudentLayout({ children }) {
  return (
    <section className="flex">
      <SideBar />
      <ProtectedRoute type="student">{children}</ProtectedRoute>
    </section>
  );
}
