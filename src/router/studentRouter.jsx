import { Navigate } from "react-router";

import Leaderboard from "@/pages/student/Leaderboard";
import Login from "@/pages/student/Login";
import Dashboard from "@/pages/student/Dashboard";
import Error404 from "@/pages/404";

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
        element: <Leaderboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "*",
        element: <Error404 />,
      },
    ],
  },
];

export default router;
