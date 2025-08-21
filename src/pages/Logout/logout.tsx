import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetAuth } from "../../store/auth/LoginSlice";
import { toast } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt");

    dispatch(resetAuth());
    toast.success("Successfully logged out");

    navigate("/admin", { replace: true });
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
