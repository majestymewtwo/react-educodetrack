import { Navigate } from "react-router";

import Login from "@/pages/faculty/Login";
import Dashboard from "@/pages/faculty/Dashboard";
import Profile from "@/pages/faculty/Profile";
import Register from "@/pages/faculty/Register";
import Leaderboard from "@/pages/faculty/Leaderboard";
import Error404 from "@/pages/404";
import FacultyLayout from "@/components/faculty/FacultyLayout";

const router = [
  {
    path: "/faculty",
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
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: (
          <FacultyLayout>
            <Dashboard />
          </FacultyLayout>
        ),
      },
      {
        path: "profile/:student_id",
        element: (
          <FacultyLayout>
            <Profile />
          </FacultyLayout>
        ),
      },
      {
        path: "leaderboard",
        element: (
          <FacultyLayout>
            <Leaderboard />
          </FacultyLayout>
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
