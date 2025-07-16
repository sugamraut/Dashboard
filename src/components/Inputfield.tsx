import React from "react";
import {
  FormControl,
  FilledInput,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type LoginInputProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  iconClass?: string;
};

const LoginInput: React.FC<LoginInputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  showPassword,
  togglePasswordVisibility,
  iconClass,
}) => {
  return (
    <FormControl variant="filled" fullWidth sx={{ mb: 3 }}>
      <InputLabel htmlFor={id} style={{ fontSize: 18, fontWeight: "bolder" }}>
        {label}
      </InputLabel>

      <FilledInput
        id={id}
        type={
          type === "password" && showPassword !== undefined
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        value={value}
        onChange={onChange}
        // startAdornment={
            
        //   iconClass && (
        //     <InputAdornment position="start">
        //       <i
        //         className={iconClass}
        //         style={{ fontSize: "1rem", marginRight: "12px" }}
        //       />
        //     </InputAdornment>
        //   )
        // }
        endAdornment={
          type === "password" &&
          togglePasswordVisibility && (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }
        required
      />
    </FormControl>
  );
};

export default LoginInput;
