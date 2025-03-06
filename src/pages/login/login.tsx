import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSnackbar } from "notistack";
import { Button, TextField } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";

import authStyles from "../auth.module.css";
import loginStyles from "./login.module.css";

import axios from "axios";

import API_BASE_URL from "../../config";

import { useAuth } from "../../context/AuthContext";

const login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const isValidEmail = (email: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (!newEmail) {
      setEmailError("Email is required!");
    } else if (!isValidEmail(newEmail)) {
      setEmailError("Must contain '@' and '.'");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const isValidPassword = (password: string) => {
      return password.length >= 8;
    };

    if (!newPassword) {
      setPasswordError("Password is required!");
    } else if (!isValidPassword(newPassword)) {
      setPasswordError("Password length must be 8.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      enqueueSnackbar("Email and password are required!", { variant: "error" });
      return;
    }

    if (emailError || passwordError) {
      enqueueSnackbar("Please fix the errors before registering!", {
        variant: "error",
      });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      login(response.data);

      enqueueSnackbar(response.data.message, { variant: "success" });

      navigate("/");
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || "Login failed. Try again!",
        { variant: "error" }
      );
    }
  };

  const handleSuccess = (response: any) => {
    console.log("Google Login Success:", response);
    enqueueSnackbar("Logged in successfully!", { variant: "success" });
  };

  const handleError = () => {
    enqueueSnackbar("Google login failed!", { variant: "error" });
  };

  return (
    <div className={authStyles.container}>
      <div className={authStyles.formWrapper}>
        <h2 className={authStyles.heading}>Login</h2>

        <TextField
          fullWidth
          type="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={handlePasswordChange}
          error={!!passwordError}
          helperText={passwordError}
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          disabled={!!emailError || !!passwordError || !email || !password}
          sx={{ mt: 2, mb: 2 }}
        >
          Login
        </Button>

        <p className={loginStyles.orText}>— OR —</p>

        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />

        <p className={authStyles.register}>
          Need an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default login;
