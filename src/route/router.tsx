import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import PrivateRoute from "./private_route";
import RootLayout from "../layouts/rootlayout";
import Login from "../pages/Auth/login";
import LoadingButtons from "../pages/loader";

const Dashboard = React.lazy(() => import("../pages/Dashboard/dashboard"));
const Sidebar = React.lazy(() => import("../pages/sidebar"));
const BrandingSignInPage = React.lazy(() => import("../pages/Branches/branch"));
const District = React.lazy(() => import("../pages/Districts/districts"));
const Cities = React.lazy(() => import("../pages/Cities/cities"));
const loading=React.lazy(()=>import("../pages/loader"));
const User = React.lazy(() => import("../pages/Users/users"));
const Account = React.lazy(() => import("../pages/Account/Account"));
const Permission = React.lazy(() => import("../pages/Permissions/permissions"));
const Role = React.lazy(() => import("../pages/Role/role"));
const Profile = React.lazy(() => import("../pages/Profile/profile"));
const ScannedLog = React.lazy(() => import("../pages/ScannedLog/scannedlog"));
const ActivityLog = React.lazy(
  () => import("../pages/ActivityLog/activitylog")
);
const Setting = React.lazy(() => import("../pages/Setting/setting"));
const OnlineAccount = React.lazy(
  () => import("../pages/OnlineAccountRequest/onlinerequest")
);

const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<any>>
) => (
  <Suspense fallback={<LoadingButtons />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/" replace />,
        // <Login />
      },
      {
        path: "/admin",
        element: <Login />,
      },
      {
        path: "/admin",
        element: <PrivateRoute />,
        children: [
          { path: "sidebar", element: withSuspense(Sidebar) },
          { path: "dashboard", element: withSuspense(Dashboard) },
          { path: "branch", element: withSuspense(BrandingSignInPage) },
          { path: "district", element: withSuspense(District) },
          { path: "cities", element: withSuspense(Cities) },
          { path: "User", element: withSuspense(User) },
          { path: "Account", element: withSuspense(Account) },
          { path: "permission", element: withSuspense(Permission) },
          { path: "role", element: withSuspense(Role) },
          { path: "profile", element: withSuspense(Profile) },
          { path: "scannedlog", element: withSuspense(ScannedLog) },
          { path: "activitylog", element: withSuspense(ActivityLog) },
          { path: "setting", element: withSuspense(Setting) },
          { path: "onlineaccount", element: withSuspense(OnlineAccount) },
          {path:"loading",element:withSuspense(loading)}
        ],
      },
    ],
  },
]);

export default router;
