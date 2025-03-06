import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSnackbar } from "notistack";
import { Button, TextField } from "@mui/material";

import authStyles from "../auth.module.css";

import axios from "axios";

import API_BASE_URL from "../../config";

const register = () => {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
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

  const handleRegister = async () => {
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
      const response = await axios.post(`${API_BASE_URL}/register`, {
        firstname,
        lastname,
        email,
        password,
      });

      enqueueSnackbar(response.data.message, { variant: "success" });

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.error || "Registration failed. Try again!",
        { variant: "error" }
      );
    }
  };

  return (
    <div className={authStyles.container}>
      <div className={authStyles.formWrapper}>
        <h2 className={authStyles.heading}>Register</h2>

        <TextField
          fullWidth
          type="firstname"
          label="Firstname"
          placeholder="Enter your firstname here"
          variant="outlined"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />

        <TextField
          fullWidth
          type="lastname"
          label="Lastname"
          placeholder="Enter your lastname here"
          variant="outlined"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          type="email"
          label="Email"
          placeholder="Enter your email here"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          placeholder="Enter new password"
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
          onClick={handleRegister}
          disabled={!!emailError || !!passwordError || !email || !password}
          sx={{ mt: 2, mb: 2 }}
        >
          Register
        </Button>

        <p className={authStyles.register}>
          Already have a account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default register;
