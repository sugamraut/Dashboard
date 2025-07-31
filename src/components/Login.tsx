import React from "react";
import {
  FormControl,
  FilledInput,
  InputLabel,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type LoginInputProps = {
  id: string;
  label: string;
  type?: string;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  error?: boolean;
  helperText?: React.ReactNode;
};

const LoginInput = React.forwardRef<HTMLInputElement, LoginInputProps>(
  (
    {
      id,
      label,
      type = "text",
      showPassword,
      togglePasswordVisibility,
      error,
      helperText,
      ...rest
    },
    ref
  ) => {
    const isPassword = type === "password";
    const inputType = isPassword && showPassword !== undefined
      ? showPassword ? "text" : "password"
      : type;

    return (
      <FormControl variant="filled" fullWidth sx={{ mb: 3 }} error={error}>
        <InputLabel htmlFor={id} sx={{ fontSize: 18, fontWeight: "bold" }}>
          {label}
        </InputLabel>

        <FilledInput
          id={id}
          type={inputType}
          inputRef={ref}
          {...rest}
          endAdornment={
            isPassword && togglePasswordVisibility && (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end" size="small">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        />

        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }
);

export default LoginInput;
