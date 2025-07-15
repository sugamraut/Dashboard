import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/rootlayouts";
import Home from "./pages/homepage"
import Login from "./pages/loginpage"
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/custom.scss"
import BrandingSignInPage from "./pages/demo";
const router = createBrowserRouter([
  {
    path: "/admin/",
    element: <RootLayout />,
    children: [
      { index: true, element:  <Login/> },
      { path: 'admin', element: <Home /> },
      {path:"demo",element:<BrandingSignInPage/>},
      // { path: '*', element: <NotFound /> }
    ],
  },
]);

export default router;
