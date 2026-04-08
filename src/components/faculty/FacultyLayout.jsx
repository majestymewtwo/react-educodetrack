import ProtectedRoute from "../common/ProtectedRoute";
import SideBar from "./SideBar";

export default function FacultyLayout({ children }) {
  return (
    <section className="flex">
      <SideBar />
      <ProtectedRoute type="faculty">{children}</ProtectedRoute>
      
    </section>
  );
}
