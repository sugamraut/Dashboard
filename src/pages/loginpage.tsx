import React, { useState } from "react";
import image from "../assets/image/company_name.png";
import {
  Box,
  FormControl,
  FilledInput,
  InputLabel,
  InputAdornment,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const loginpage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in:", username, password);
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <div className="login-section">
      <div className="login-container d-flex justify-content-center align-items-center">
        <div
          className="login-box p-4 rounded shadow"
          style={{ maxWidth: 450, width: "100%",maxHeight:450,height:"100%" }}
        >
          <div className="text-center mb-3">
            <img src={image} alt="Sunlife Logo" className="mb-3" width="80" />
            <Typography variant="h5" fontWeight="bold" className="mb-2">
              Administrative Login
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom className="mb-2">
              Login using your username and password.
            </Typography>
          </div>

          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" >
            <FormControl variant="filled" fullWidth sx={{ mb: 3 }} className="mb-3">
              <InputLabel htmlFor="username" style={{fontSize:18,fontWeight:"bolder"}} className="mb-3" >Username</InputLabel>
              <FilledInput
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <i
                      className="fa-regular fa-circle-user"
                      style={{ marginRight: "12px", fontSize: "1rem" }}
                    />
                  </InputAdornment>
                }
                required
              />
            </FormControl>

            <FormControl variant="filled" fullWidth sx={{ mb: 3 }} >
              <InputLabel htmlFor="password" style={{fontSize:18,fontWeight:"bolder"}}  >Password</InputLabel>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <FilledInput
                id="password"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <i
                      className="fa-solid fa-fingerprint"
                      style={{ fontSize: "1rem" }}
                    />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      aria-label="toggle password visibility"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                required
              />
              </Box>
            </FormControl>

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
