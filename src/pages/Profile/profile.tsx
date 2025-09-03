import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import type { RootState } from "../../store/store";
import { fetchProfile, updateProfile } from "../../store/profile/ProfileSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProfileSchema,
  type ProfileFormData,
} from "../../globals/ZodValidation";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state: RootState) => state.profile);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      mobilenumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  // const password = watch("password");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        username: data.username || "",
        email: data.email || "",
        mobilenumber: data.mobilenumber || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: ProfileFormData) => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(
      updateProfile({
        id: data?.id ?? 0,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        mobilenumber: formData.mobilenumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box marginLeft={9} padding={2}>
      <Typography variant="h5" fontWeight="bold" color="#043BA0" fontSize={24}>
        Profile
      </Typography>
      <hr />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              margin="normal"
              sx={{ width: "50%" }}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Username"
              margin="normal"
              sx={{ width: "48%", marginLeft: "12px" }}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              margin="normal"
              sx={{ width: "50%" }}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="mobilenumber"
          control={control}
          rules={{
            required: "Mobile number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10-digit number",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mobile"
              margin="normal"
              sx={{ width: "48%", marginLeft: "12px" }}
              error={!!errors.mobilenumber}
              helperText={errors.mobilenumber?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="New Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              sx={{ width: "50%" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              sx={{ width: "48%", marginLeft: "12px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Box mt={3} textAlign="right">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Submit"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Profile;
