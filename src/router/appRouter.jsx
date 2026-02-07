import { createBrowserRouter, Navigate } from "react-router";

import facultyRouter from "./facultyRouter";
import studentRouter from "./studentRouter";
import Error404 from "@/pages/404";

const router = createBrowserRouter([
  ...facultyRouter,
  ...studentRouter,
  {
    index : true,
    element : <Navigate to='/student' />
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

export default router;
