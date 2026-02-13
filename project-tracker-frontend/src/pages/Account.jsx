// src/pages/Account.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Stack,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    api
      .get("/api/v1/auth/me")
      .then((res) => {
        // backend must return full URL in res.data.profile_pic
        setUser(res.data);
      })
      .catch((err) => console.error("Error fetching user info:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await api.post("/api/v1/auth/upload-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update state with cache-busting
      setUser((prev) => ({
        ...prev,
        profile_pic: `${res.data.profile_pic}?t=${new Date().getTime()}`,
      }));
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6, px: 2 }}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Avatar */}
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            src={user?.profile_pic || ""}
            sx={{
              width: 120,
              height: 120,
              fontSize: 40,
              cursor: "pointer",
              border: "3px solid #1976d2",
            }}
            onClick={handleProfilePicClick}
          >
            {user?.user_name?.[0]?.toUpperCase() || "U"}
          </Avatar>

          <IconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "white",
              border: "1px solid #ccc",
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
            onClick={handleProfilePicClick}
          >
            <PhotoCamera />
          </IconButton>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>

        {/* Name and Info */}
        <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
          {user?.user_name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user?.email}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            px: 2,
            py: 0.5,
            borderRadius: 2,
            bgcolor: "#f0f0f0",
            display: "inline-block",
            fontWeight: 500,
          }}
        >
          {user?.job_profile}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/set-password")}
          >
            Change Password
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            disabled={uploading}
          >
            Logout
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Account;
