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
import useDocumentTitle from "../../globals/useBrowserTitle";

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
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  // const password = watch("password");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  useDocumentTitle("Profile - SNLI");

 useEffect(() => {
  console.log("Fetched profile data:", data);
  if (data && data.length > 0) {
    const user = data[0];
    console.log("efdb",user)
    reset({
      name: user.name,
      username: user.username || "",
      email: user.email || "",
      mobile: user.mobile || "",
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
        id: formData?.id!,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        mobilenumber: formData.mobile,
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
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#043BA0"
        fontSize={24}
        fontFamily="lato"
      >
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
          name="mobile"
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
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
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
