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
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5EDED"
      }}
    >
      <Paper sx={{ padding: 4, width: 350 }}>
        <Typography 
        variant="h5" 
        align="center" 
        mb={2}
        sx={{
          color:"#6482AD",
          fontWeight: "bold"
        }}
        >
          Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#7FA1C3",
            "&:hover": {
              backgroundColor: "#E2DAD6"
  }
}}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography align="right" variant="body2" sx={{ mt: 1 }}>
  <Link component={RouterLink} to="/forgot-password">
    Forgot Password?
  </Link>
</Typography>

      </Paper>
    </Box>
  );
};

export default Login;
