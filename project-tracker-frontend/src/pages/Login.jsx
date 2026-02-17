import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  Link
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log("LOGIN BUTTON CLICKED");
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/v1/auth/login",
      {
        email: email,
        password: password
      }
    );

    console.log("AFTER API call");
    console.log("RESPONSE:", res.data);
    // SAVE JWT
    localStorage.setItem("token", res.data.access_token);

    // SAVE ROLE (FOR PROTECTED ROUTES)
    localStorage.setItem("role", res.data.job_profile);


    // ---------- SAVE CONTEXT CORRECT ----------
    localStorage.setItem(
  "user",
  JSON.stringify({
    user_id: res.data.user_id,
    job_profile: res.data.job_profile,
    user_name: res.data.user_name
  })
);

   setSuccess("Login Successful.");
   setError("");
    // ---------- ROLE BASED REDIRECT ----------
   setTimeout(() => {
  if (res.data.job_profile === "ADMIN") {
    navigate("/admin-dashboard");

  } else if (res.data.job_profile === "PROJECT MANAGER") {
    navigate("/pm/dashboard");

  } else if (res.data.job_profile === "PRODUCT MANAGER") {
    navigate("/department");

  } else {
    navigate("/project");
  }
}, 1500);


  } catch (err) {
    setError("Invalid email or password");
    console.log(err);
  }
};

return (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      px: 2,

      background: (theme) =>
        theme.palette.mode === "dark"
          ? `radial-gradient(circle at 20% 20%, ${theme.palette.primary.main}15, #0F172A 60%)`
          : `linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%)`,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        width: 400,
        p: 5,
        borderRadius: 3,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",

        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 20px 60px rgba(0,0,0,0.55)"
            : "0 20px 40px rgba(0,0,0,0.06)",
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        align="center"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: "text.primary",
          letterSpacing: "-0.5px",
        }}
      >
        Welcome Back
      </Typography>

      <Typography
        align="center"
        variant="body2"
        sx={{ color: "text.secondary", mb: 4 }}
      >
        Sign in to continue to your dashboard
      </Typography>

      {/* Email */}
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "#1E293B"
                : "#ffffff",

            "& fieldset": {
              borderColor: "divider",
            },
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
              borderWidth: 2,
            },
          },
        }}
      />

      {/* Password */}
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "#1E293B"
                : "#ffffff",

            "& fieldset": {
              borderColor: "divider",
            },
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
              borderWidth: 2,
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
        sx={{
          mt: 3,
          py: 1.2,
          borderRadius: 2,
          fontWeight: 600,
          textTransform: "none",

          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? `0 6px 20px ${theme.palette.primary.main}40`
              : "0 4px 14px rgba(0,0,0,0.08)",
        }}
      >
        Sign In
      </Button>

      {/* Forgot */}
      <Typography align="right" variant="body2" sx={{ mt: 2 }}>
        <Link
          component={RouterLink}
          to="/forgot-password"
          underline="hover"
        >
          Forgot Password?
        </Link>
      </Typography>
    </Paper>
  </Box>
);


};

export default Login;
