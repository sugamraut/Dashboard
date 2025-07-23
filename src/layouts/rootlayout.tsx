import { useDispatch } from "react-redux";
import { setToken, setStatus } from "../store/auth/LoginSlice";
import { isTokenValid } from "../utils/helper";
import { useEffect, useState } from "react";
import { Status } from "../globals/status";
import Sidebar from "../pages/sidebar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const dispatch = useDispatch();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && isTokenValid(token)) {
      dispatch(setToken(token));
      dispatch(setStatus(Status.Success));
      setAuthenticated(true);
    } else {
      localStorage.removeItem("jwt");
      dispatch(setStatus(Status.Error));
      setAuthenticated(false);
    }
  }, [dispatch]);

  return (
    <>
      {authenticated && <Sidebar />}

      <Outlet />
    </>
  );
};

export default RootLayout;
