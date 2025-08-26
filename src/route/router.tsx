import React, {  Suspense } from "react";
import { createBrowserRouter, Navigate} from "react-router-dom";

import PrivateRoute from "./privateroute";
import RootLayout from "../layouts/rootlayout";
import Login from "../pages/Auth/login";
import LoadingButtons from "../pages/loader";

const lazyWithDelay = (importFunc: () => Promise<any>) =>
  React.lazy(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(importFunc());
        });
      })
  );

const Dashboard = lazyWithDelay(() => import("../pages/Dashboard/dashboard"));
const Sidebar = lazyWithDelay(() => import("../pages/sidebar"));
const BrandingSignInPage = lazyWithDelay(
  () => import("../pages/Branches/branch")
);
const District = lazyWithDelay(() => import("../pages/Districts/districts"));
const Cities = lazyWithDelay(() => import("../pages/Cities/cities"));

const User = lazyWithDelay(() => import("../pages/Users/users"));
const Account = lazyWithDelay(() => import("../pages/Account/Account"));
// const Xyz =lazyWithDelay(()=>import("../xyz"))
const Permission = lazyWithDelay(
  () => import("../pages/Permissions/permissions")
);
const Role = lazyWithDelay(() => import("../pages/Role/role"));
const Add = lazyWithDelay(() => import("../pages/Permissions/add_edit"));
const Profile = lazyWithDelay(() => import("../pages/Profile/profile"));
const ScannedLog = lazyWithDelay(
  () => import("../pages/ScannedLog/scannedlog")
);
const ActivityLog = lazyWithDelay(
  () => import("../pages/ActivityLog/activitylog")
);
const Setting = lazyWithDelay(() => import("../pages/Setting/setting"));
const Logout = lazyWithDelay(() => import("../pages/Logout/logout"));
const OnlineAccount = lazyWithDelay(
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
      path:"/admin",
      element:<Login/>
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
          { path: "Add", element: withSuspense(Add) },
          { path: "profile", element: withSuspense(Profile) },
          { path: "scannedlog", element: withSuspense(ScannedLog) },
          { path: "activitylog", element: withSuspense(ActivityLog) },
          { path: "setting", element: withSuspense(Setting) },
          { path: "logout", element: withSuspense(Logout) },
          { path: "onlineaccount", element: withSuspense(OnlineAccount) },
        ],
      },
    ],
  },
]);

export default router;
