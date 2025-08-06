import {
  Autocomplete,
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { updateuserdataThunk } from "../../store/user/userSlice";

interface EditUserProps {
  open: boolean;
  handleClose: () => void;
  userId: number;
}

const genderOptions = ["Male", "Female", "Other"];
const roleOptions = ["Admin", "User", "Manager"];

const EditUser: React.FC<EditUserProps> = ({ open, handleClose, userId }) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.User.list);

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      mobilenumber: "",
      email: "",
      username: "",
      gender: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (users && userId) {
      const user = users.find((u) => u.id === userId);
      if (user) {
        reset({
          name: user.name || "",
          mobilenumber: user.mobilenumber || "",
          email: user.email || "",
          username: user.username || "",
          gender: user.gender || "",
          role: user.role || "",
          password: "",
          confirmPassword: "",
        });
      }
    }
  }, [userId, users, reset]);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const onSubmit = async (data: any) => {
    if (data.password && data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...payload } = data;

    try {
      await dispatch(updateuserdataThunk(userId, payload) as any);
      handleClose();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" mb={3}>
          Edit User
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="mobilenumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mobile Number"
                fullWidth
                margin="normal"
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                fullWidth
                margin="normal"
              />
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={genderOptions}
                value={field.value || ""}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Gender"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={roleOptions}
                value={field.value || ""}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Confirm Password</InputLabel>
                <OutlinedInput
                  {...field}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
              </FormControl>
            )}
          />

          
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Update
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditUser;
