import { createBrowserRouter } from "react-router";

import facultyRouter from "./facultyRouter";
import studentRouter from "./studentRouter";
import Error404 from "@/pages/404";

const router = createBrowserRouter([
  ...facultyRouter,
  ...studentRouter,
  {
    path: "*",
    element: <Error404 />,
  },
]);

export default router;
