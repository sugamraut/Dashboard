import { Outlet, Link } from "react-router-dom";
import Sidebar from "../pages/sidebar";


const RootLayout: React.FC = () => {
  return (
    <><div>
      <Sidebar/>

    </div>
       
      <Outlet />
    </>
  );
};

export default RootLayout;
