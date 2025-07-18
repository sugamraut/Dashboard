import React, { useState } from "react";
import image from "../../assets/image/company_name.png";
import { Box, Button, Typography } from "@mui/material";
import LoginInput from "../../components/Input_field"

const loginpage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in:", username, password);
  };

  return (
    <div className="login-section">
      <div className="login-container d-flex justify-content-center align-items-center">
        <div
          className="login-box p-4 rounded shadow"
        >
          <div className="text-center mb-3">
            <img src={image} alt="Sunlife Logo" className="mb-3" width="80" />
            <Typography variant="h5" fontWeight="bold" className="mb-2">
              Administrative Login
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              className="mb-2"
            >
              Login using your username and password.
            </Typography>
          </div>

          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <LoginInput
              id="username"
              label="Username"
              value={username}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUsername(e.target.value)}
              iconClass="fa-regular fa-circle-user"
            />

            <LoginInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
              showPassword={showPassword}
              togglePasswordVisibility={() => setShowPassword(!showPassword)}
              iconClass="fa-solid fa-fingerprint"
            />

            <Button type="submit" variant="contained" fullWidth>
              LOGIN
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default loginpage;
