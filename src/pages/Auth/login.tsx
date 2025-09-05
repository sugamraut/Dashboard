import React, { useState, useEffect } from "react";
import image from "../../assets/image/company_name.png";
import { Box, Button, Typography } from "@mui/material";
import LoginInput from "../../components/Login";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchAuthAsync } from "../../store/auth/LoginSlice";
import type { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Status } from "../../globals/status";
import { toast } from "react-toastify";
import { loginSchema, type LoginFormInputs } from "../../globals/ZodValidation";
import { useAppDispatch, useAppSelector } from "../../store/hook";

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { status, error, accessToken } = useAppSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    dispatch(fetchAuthAsync(data));
  };

  useEffect(() => {
    if (status === Status.Success && accessToken) {
      localStorage.setItem("jwt", accessToken);
      const gettoken = localStorage.getItem("jwt");
      if (gettoken) {
        navigate("/admin/dashboard");
      }

      //  sessionStorage.getItem("alreadyNavigated");
      toast.success("Login successful! Redirecting...");
    } else if (status === Status.Error && error) {
      toast.error(error);
      localStorage.removeItem("jwt");
    }
  }, [status, accessToken, navigate]);

  return (
    <div className="login-section">
      <div className="login-container d-flex justify-content-center align-items-center">
        <div className="login-box p-4 rounded shadow">
          <div className="text-center mb-3">
            <img src={image} alt="Sunlife Logo" className="mb-3" width="80" />
            <Typography variant="h5" fontWeight="bold" className="mb-2">
              Administrative Login
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              className="mb-2"
            >
              Login using your username and password.
            </Typography>
          </div>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <LoginInput
              id="username"
              label="Username"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <LoginInput
              id="password"
              label="Password"
              // type={showPassword ? "text" : "password"}
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
            />

            <Button type="submit" variant="contained" fullWidth>
              LOGIN
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
