import { Navigate } from "react-router";

import Login from "@/pages/faculty/Login";
import Dashboard from "@/pages/faculty/Dashboard";
import Profile from "@/pages/faculty/Profile";
import Register from "@/pages/faculty/Register";
import Leaderboard from "@/pages/faculty/Leaderboard";
import Error404 from "@/pages/404";

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
        element: <Dashboard />,
      },
      {
        path: "profile/:student_id",
        element: <Profile />,
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "*",
        element: <Error404 />,
      },
    ],
  },
];

export default router;
