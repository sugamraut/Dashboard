import React from "react";
import {
  FormControl,
  FilledInput,
  InputLabel,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type LoginInputProps = {
  id: string;
  label: string;
  type?: string;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  error?: boolean;
  helperText?: React.ReactNode;
} ;

const LoginInput:React.FC<LoginInputProps> =(
  (
    {
      id,
      label,
      type = "text",
      showPassword,
      togglePasswordVisibility,
      error,
      helperText,
    },
  ) => {
    const inputType =
      type === "password" && showPassword !== undefined
        ? showPassword
          ? "text"
          : "password"
        : type;

    return (
      <FormControl variant="filled" fullWidth sx={{ mb: 3 }} error={error}>
        <InputLabel
          htmlFor={id}
          style={{ fontSize: 18, fontWeight: "bolder" }}
        >
          {label}
        </InputLabel>

        <FilledInput
          id={id}
          type={inputType}
          endAdornment={
            type === "password" && togglePasswordVisibility ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : undefined
          }
        />

        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }
);

export default LoginInput;
