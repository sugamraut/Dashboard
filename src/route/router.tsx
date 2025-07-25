import PrivateRoute from "./PrivateRoute";
import Home from "../pages/sidebar";
import Login from "../pages/auth/loginpage";
import Dashboard from "../pages/dashboard/dashboard";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/rootlayout";
import District from "../pages/Districts/districts";
import Cities from "../pages/cities/cities";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/custom.css";
import BrandingSignInPage from "../pages/branches/branchpage";
const router = createBrowserRouter([
  {
    path: "/admin/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Login /> },
      {
        path: "",
        element: <PrivateRoute />,
        children: [
          { path: "home", element: <Home /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "branch", element: <BrandingSignInPage /> },
          { path: "district", element: <District /> },
          { path: "cities", element: <Cities /> },
        ],
      },
    ],
  },
]);
export default router;
