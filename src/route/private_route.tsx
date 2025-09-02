import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";
import { isTokenValid } from "../utils/helper";
import { Status } from "../globals/status";
import Loading from "../pages/loader";
import { useAppSelector } from "../store/hook";

const PrivateRoute: React.FC = () => {
  const { accessToken, status } = useAppSelector((state: RootState) => state.auth);

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
