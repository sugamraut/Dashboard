import React, { useState } from "react";
import image from "../assets/image/company_name.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Logging in:", username, password);
  };

  return (
    <div className="login-section">
      <div className="login-container d-flex justify-content-center align-items-center">
        <div className="login-box p-4 rounded shadow">
          <div className="text-center mb-3">
            <img src={image} alt="Sunlife Logo" className="mb-2" width="80" />
            <h5 className="fw-bold">Administrative Login</h5>
            <p className="text-muted small">
              Login using your username and password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 input-group">
              <span className="input-group-text bg-light">
               <i className="fa-regular fa-circle-user"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Username/Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 input-group">
              <span className="input-group-text bg-light">
                <i className="fa-solid fa-fingerprint"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
