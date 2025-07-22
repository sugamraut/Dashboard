import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/rootlayout";
import Home from "./pages/sidebar";
import Login from "./pages/auth/loginpage";
import Dashboard from "./pages/dashboard/dashboard";
import District from "./pages/Districts/districts";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/custom.scss";
import BrandingSignInPage from "./pages/branches/branchpage";
const router = createBrowserRouter([
  {
    path: "/admin/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "home", element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "branch", element: <BrandingSignInPage /> },
      { path: "Disrict", element: <District /> },
      // { path: "branch/edit", element: <Editfield /> },
      // { path: "addform", element: <Addpage /> },
      // { path: "demo", element: <Demo /> },
      // { path: '*', element: <NotFound /> }
    ],
  },
]);

export default router;
