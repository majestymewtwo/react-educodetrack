import { Navigate } from "react-router";

import Leaderboard from "@/pages/student/Leaderboard";
import Login from "@/pages/student/Login";
import Dashboard from "@/pages/student/Dashboard";
import Error404 from "@/pages/404";
import StudentLayout from "@/components/student/StudentLayout";
import Profile from "@/pages/student/Profile";

const router = [
  {
    path: "/student",
    children: [
      {
        index: true,
        element: <Navigate to="login" />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "leaderboard",
        element: (
          <StudentLayout>
            <Leaderboard />
          </StudentLayout>
        ),
      },
      {
        path: "dashboard",
        element: (
          <StudentLayout>
            <Dashboard />
          </StudentLayout>
        ),
      },
      {
        path: "profile",
        element: (
          <StudentLayout>
            <Profile />
          </StudentLayout>
        ),
      },
      {
        path: "*",
        element: <Error404 />,
      },
    ],
  },
];

export default router;
