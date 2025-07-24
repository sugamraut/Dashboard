import React from "react";
import TextField from "@mui/material/TextField";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  fullWidth?: boolean;
  type?:string;
  margin?: "none" | "dense" | "normal";
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type,
  required = false,
  fullWidth = false,
  margin = "none",
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      type={type}
      onChange={onChange}
      required={required}
      fullWidth={fullWidth}
      margin={margin}
      
    />
  );
};

export default InputField;
