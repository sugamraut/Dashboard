import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/rootlayouts";
import Home from "./pages/homepage"
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/custom.scss"
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      // { path: 'contact', element: <Contact/> },
      // { path: '*', element: <NotFound /> }
    ],
  },
]);

export default router;
