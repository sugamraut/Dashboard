import React, { useState, useEffect } from "react";
import image from "../../assets/image/company_name.png";
import { Box, Button, Typography, Alert } from "@mui/material";
import LoginInput from "../../components/Login";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthAsync } from "../../store/auth/LoginSlice";
import type { RootState, AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Status } from "../../globals/status";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(15, "Password is too long"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { status, error,accessToken } = useSelector((state: RootState) => state.auth);
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
   navigate("/admin/dashboard");
     sessionStorage.getItem("alreadyNavigated");
    // // if (!hasNavigated) {
    // //   navigate("/admin/dashboard");
    // //   sessionStorage.setItem("alreadyNavigated", "true");
    // // }
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

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
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

            {error && (
              <Alert severity="error" className="mt-2">
                {error}
              </Alert>
            )}
            <Button type="submit" variant="contained" fullWidth>
              LOGIN
            </Button>
          </Box>
        </div>
      </div>
    </div>
  )
};

export default LoginPage
