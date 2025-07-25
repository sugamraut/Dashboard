import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import RootLayout from "../layouts/rootlayout";
import Login from "../pages/auth/loginpage";
import LoadingButtons from "../pages/demo";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/custom.css";


const lazyWithDelay = (importFunc: () => Promise<any>, delay: number = 800) =>
  React.lazy(() =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(importFunc());
      }, delay);
    })
  );


const Dashboard = lazyWithDelay(() => import("../pages/dashboard/dashboard"));
const Sidebar = lazyWithDelay(() => import("../pages/sidebar"));
const BrandingSignInPage = lazyWithDelay(() => import("../pages/branches/branchpage"));
const District = lazyWithDelay(() => import("../pages/Districts/districts"));
const Cities = lazyWithDelay(() => import("../pages/cities/cities"));
const Demo = lazyWithDelay(() => import("../pages/demo"));


const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
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
        ],
      },
    ],
  },
]);

export default router;
