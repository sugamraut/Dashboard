import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { updateuserdataThunk } from "../../store/user/userSlice";
import type { UserProfile } from "../../globals/typeDeclaration";

interface EditUserProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

const genderOptions = ["Male", "Female", "Other"];
const roleOptions = ["Admin", "User", "Manager"];

interface FormValues {
  name: string;
  mobilenumber: string;
  email: string;
  username: string;
  gender: string;
  role: string;
  password: string;
  confirmPassword: string;
}

const EditUser: React.FC<EditUserProps> = ({ open, onClose, userId }) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.User.list||[]);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<FormValues>({
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
  }, [userId, users, reset]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: FormValues) => {
    if (data.password && data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...payload } = data;

    try {
      await dispatch(updateuserdataThunk(userId, payload) as any);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>

          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Mobile Number"
            fullWidth
            margin="normal"
            {...register("mobilenumber")}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Username"
            fullWidth
            margin="normal"
            {...register("username")}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Autocomplete
                options={genderOptions}
                value={field.value || ""}
                onChange={(_, val) => field.onChange(val)}
                renderInput={(params) => (
                  <TextField {...params} label="Gender" margin="normal" fullWidth />
                )}
              />
            )}
          />

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Autocomplete
                options={roleOptions}
                value={field.value || ""}
                onChange={(_, val) => field.onChange(val)}
                renderInput={(params) => (
                  <TextField {...params} label="Role" margin="normal" fullWidth />
                )}
              />
            )}
          />

          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              {...register("password")}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              {...register("confirmPassword")}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;
