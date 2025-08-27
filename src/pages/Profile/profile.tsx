import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
  fetchProfile,
  updateProfile,
} from "../../store/profile/ProfileSlice";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.profile);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        name: data.name || "",
        username: data.username || "",
        email: data.email || "",
        mobile: data.mobile || "",
      }));
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(
      updateProfile({
        id: data?.id !== undefined ? data.id : 0,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    );
  };


  // console.log("==>", data);
  return (
    <Box marginLeft={9} padding={2}>
      <Typography variant="h5" fontWeight="bold" color="#043BA0" fontSize={24}>
        Profile
      </Typography>
      <hr />

      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          margin="normal"
          sx={{ width: "50%" }}
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          name="username"
          label="Username"
          margin="normal"
          sx={{ width: "48%", marginLeft: "12px" }}
          value={formData.username}
          onChange={handleChange}
        />

        <TextField
          name="email"
          label="Email"
          margin="normal"
          sx={{ width: "50%" }}
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          name="mobile"
          label="Mobile"
          margin="normal"
          sx={{ width: "48%", marginLeft: "12px" }}
          value={formData.mobile}
          onChange={handleChange}
        />

        <TextField
          name="password"
          label="New Password"
          type={showPassword ? "text" : "password"}
          margin="normal"
          sx={{ width: "50%" }}
          value={formData.password}
          onChange={handleChange}
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

        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          margin="normal"
          sx={{ width: "48%", marginLeft: "12px" }}
          value={formData.confirmPassword}
          onChange={handleChange}
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

        <Box mt={3} textAlign="right" gap={2}>
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
