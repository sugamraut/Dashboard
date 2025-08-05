import { RouterProvider } from "react-router-dom";
import router from "./route/router";
import { ToastContainer} from 'react-toastify';


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/custom.css";

function App() {
  return <div>
    <RouterProvider router={router} />;

  </div>
}

export default App;
