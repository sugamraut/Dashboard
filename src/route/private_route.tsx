import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { isTokenValid } from "../utils/helper";
import { Status } from "../globals/status";
import Loading from "../pages/loader";

const PrivateRoute: React.FC = () => {
  const { accessToken, status } = useSelector((state: RootState) => state.auth);

  if (status === Status.Loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const loggedIn = status === Status.Success && isTokenValid(accessToken);

  return loggedIn ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default PrivateRoute;
