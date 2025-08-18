import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

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
const Demo = lazyWithDelay(() => import("../pages/loader"));
const User=lazyWithDelay(()=>import("../pages/Users/users"))
const Account =lazyWithDelay(()=>import("../pages/Account/Account"))
// const Xyz =lazyWithDelay(()=>import("../xyz"))
const Permission = lazyWithDelay(()=>import("../pages/Permissions/permissions"))
const Role =lazyWithDelay(()=>import("../pages/Role/role"))
const Add =lazyWithDelay(()=>import("../pages/Permissions/addedit"))
const Profile= lazyWithDelay(()=> import("../pages/Profile/profile"))

const withSuspense = (
  Component: React.LazyExoticComponent<React.ComponentType<any>>
) => (
  <Suspense fallback={<LoadingButtons />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/admin/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Login /> },
      {
        path: "",
        element: <PrivateRoute />,
        children: [
          { path: "sidebar", element: withSuspense(Sidebar) },
          { path: "dashboard", element: withSuspense(Dashboard) },
          { path: "branch", element: withSuspense(BrandingSignInPage) },
          { path: "district", element: withSuspense(District) },
          { path: "cities", element: withSuspense(Cities) },
          // { path: "demo", element: withSuspense(Demo) },
          {path:"User",element:withSuspense(User)},
          {path:"Account",element:withSuspense(Account)},
          // {path:"xyz",element:withSuspense(Xyz)},
          {path:"permission",element:withSuspense(Permission)},
          {path:"role",element:withSuspense(Role)},
          {path:"Add",element:withSuspense(Add)},
          {path:"profile" , element:withSuspense(Profile)},

        ],
      },
    ],
  },
]);

export default router;
