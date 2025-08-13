
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { setToken, setStatus } from "../store/auth/LoginSlice";
import { isTokenValid } from "../utils/helper";
import { Status } from "../globals/status";

import Sidebar from "../pages/sidebar";
import LoadingButtons from "../pages/loader";
import type { RootState } from "../store/store"; 

const RootLayout = () => {
  const dispatch = useDispatch();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const status = useSelector((state: RootState) => state.auth.status);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt")

    if (token && isTokenValid(token)) {
      dispatch(setToken(token))
      dispatch(setStatus(Status.Success))
    } else {
      localStorage.removeItem("jwt");
      dispatch(setStatus(Status.Error))
    }

    setLoading(false)
  }, [dispatch]);

  if (loading || status === Status.Loading) {
    return (
      <div>
        <LoadingButtons />
      </div>
    )
  }

  return (
    <>
      {accessToken && isTokenValid(accessToken) && <Sidebar />}
      <Outlet/> 
    </>
  )
};

export default RootLayout;
