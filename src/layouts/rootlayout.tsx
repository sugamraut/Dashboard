// import { useDispatch } from "react-redux";
// import { setToken, setStatus } from "../store/auth/LoginSlice";
// import { isTokenValid } from "../utils/helper";
// import { useEffect, useState } from "react";
// import { Status } from "../globals/status";
// import Sidebar from "../pages/sidebar";
// import { Outlet } from "react-router-dom";
// import LoadingButtons from "../pages/demo";
// const RootLayout = () => {
//   const dispatch = useDispatch();
//   const [authenticated, setAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true); 

//   useEffect(() => {
//     const token = localStorage.getItem('jwt');

//     if (token && isTokenValid(token)) {
//       dispatch(setToken(token));
//       dispatch(setStatus(Status.Success));
//       setAuthenticated(true);
//     } else {
//       localStorage.removeItem('jwt');
//       dispatch(setStatus(Status.Error));
//       setAuthenticated(false);
//     }

//     setLoading(false); 
//   }, [dispatch]);

//   if (loading) return <div><LoadingButtons/></div>; 

//   return (
//     <>
//       {authenticated && <Sidebar />}
//       <Outlet />
//     </>
//   );
// };

// export default RootLayout;
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { setToken, setStatus } from "../store/auth/LoginSlice";
import { isTokenValid } from "../utils/helper";
import { Status } from "../globals/status";

import Sidebar from "../pages/sidebar";
import LoadingButtons from "../pages/demo";
import type { RootState } from "../store/store"; // Adjust path if different
 // Adjust path if different

const RootLayout = () => {
  const dispatch = useDispatch();

  // Get values from Redux store
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const status = useSelector((state: RootState) => state.auth.status);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token && isTokenValid(token)) {
      dispatch(setToken(token));
      dispatch(setStatus(Status.Success));
    } else {
      localStorage.removeItem("jwt");
      dispatch(setStatus(Status.Error));
    }

    setLoading(false);
  }, [dispatch]);

  if (loading || status === Status.Loading) {
    return (
      <div>
        <LoadingButtons />
      </div>
    );
  }

  return (
    <>
      {accessToken && isTokenValid(accessToken) && <Sidebar />}
      <Outlet />
    </>
  );
};

export default RootLayout;
