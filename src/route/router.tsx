import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import RootLayout from "../layouts/rootlayout";
import Login from "../pages/auth/loginpage";
import LoadingButtons from "../pages/demo";

const lazyWithDelay = (importFunc: () => Promise<any>, delay: number = 800) =>
  React.lazy(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(importFunc());
        }, delay);
      })
  );

const Dashboard = lazyWithDelay(() => import("../pages/dashboard/dashboard"));
const Sidebar = lazyWithDelay(() => import("../pages/sidebar"));
const BrandingSignInPage = lazyWithDelay(
  () => import("../pages/branches/branchpage")
);
const District = lazyWithDelay(() => import("../pages/Districts/districts"));
const Cities = lazyWithDelay(() => import("../pages/cities/cities"));
const Demo = lazyWithDelay(() => import("../pages/demo"));
const User=lazyWithDelay(()=>import("../pages/users/users"))
const Account =lazyWithDelay(()=>import("../pages/Account/AccountPage"))
const Xyz =lazyWithDelay(()=>import("../xyz"))
const Add= lazyWithDelay(()=>import("../pages/Account/add_edit_pages"))


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
          { path: "demo", element: withSuspense(Demo) },
          {path:"User",element:withSuspense(User)},
          {path:"Account",element:withSuspense(Account)},
          {path:"xyz",element:withSuspense(Xyz)},
          {path:"add",element:withSuspense(Add)}

        ],
      },
    ],
  },
]);

export default router;
