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
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { createUser, updateUser } from "../../store/user/UserSlice";
import { fetchAllRole } from "../../store/role/RoleSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { userSchema, type UserFormData } from "../../globals/ZodValidation";
import InputField from "../../components/Input_field";

interface EditUserProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

const genderOptions = ["Male", "Female", "Other"];

const EditUser: React.FC<EditUserProps> = ({ open, onClose, userId }) => {
  const dispatch = useAppDispatch();
  const users = useSelector((state: RootState) => state.User.list || []);
  const Rolelist = useAppSelector(
    (state: RootState) => state.roles?.fullList ?? []
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchAllRole());
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: undefined,
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
    if (userId !== null) {
      const user = users.find((u) => u.id === userId);
      if (user) {
        reset({
          id: user.id || undefined,
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
    } else {
      reset();
    }
  }, [userId, users, reset]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: Partial<UserFormData>) => {
    const { ...payload } = data;

    try {
      if (userId !== null) {
        await dispatch(updateUser({ userId: userId, data: payload })).unwrap();
      } else {
        await dispatch(createUser(payload)).unwrap();
      }
      onClose();
      reset();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save user.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{userId ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Mobile Number"
            fullWidth
            margin="normal"
            {...register("mobilenumber")}
            error={!!errors.mobilenumber}
            helperText={errors.mobilenumber?.message}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Controller
          name="email"
          control={control}
          render={({field})=>(
            <InputField
            label="Email"
            fullWidth
            margin="normal"
            {...field}
            error={!!errors.email}
            helperText={errors.email?.message}
          />   
          )}  
          />

          {/* <InputField
            label="Username"
            fullWidth
            
            margin="normal"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          /> */}
          <Controller
          name="username"
          control={control}
          render={({field})=>(
            <InputField
            label="Username"
            fullWidth
            margin="normal"
            {...field}
            error={!!errors.username}
            helperText={errors.username?.message}
          />   
          )}
        
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
                  <TextField
                    {...params}
                    label="Gender"
                    margin="normal"
                    fullWidth
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                  />
                )}
              />
            )}
          />

          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Autocomplete
                options={Rolelist.map((role) => role.name)}
                value={field.value || ""}
                onChange={(_, val) => field.onChange(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role"
                    margin="normal"
                    fullWidth
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  />
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
              error={!!errors.password}
            />
            <p style={{ color: "red", margin: 0 }}>
              {errors.password?.message}
            </p>
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
              error={!!errors.confirmPassword}
            />
            <p style={{ color: "red", margin: 0 }}>
              {errors.confirmPassword?.message}
            </p>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;
