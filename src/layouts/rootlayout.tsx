
import { useDispatch } from "react-redux";
import { setToken, setStatus } from "../store/auth/LoginSlice";
import { isTokenValid } from "../utils/helper";
import { useEffect } from "react";
import { Status } from "../globals/status";
import Sidebar from "../pages/sidebar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && isTokenValid(token)) {
      dispatch(setToken(token));
      dispatch(setStatus(Status.Success));
    } else {
      localStorage.removeItem("jwt");
      dispatch(setStatus(Status.Error));
    }
  }, [dispatch]);
  return (
    <><div>
      <Sidebar/>

    </div>
       
      <Outlet />
    </>
  );
};

export default RootLayout;
