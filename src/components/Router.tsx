import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { isTokenValid } from "../utils/helper";

const PrivateRoute: React.FC = () => {
  const { accessToken, status } = useSelector((state: RootState) => state.auth);

  const loggedIn = status === "success" && isTokenValid(accessToken);

  return loggedIn ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default PrivateRoute;
