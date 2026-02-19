// src/components/Sidebar.jsx

import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 230;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const menuConfig = {
    "PROJECT MANAGER": [
      { label: "Dashboard", path: "/pm/dashboard" },
      { label: "My Tasks", path: "/pm/tasks" },
      { label: "Members", path: "/pm/members" },
      { label: "Settings", path: "/settings" }
    ],
    "TEAM LEADER": [
      { label: "Dashboard", path: "/tl/dashboard" },
      { label: "My Tasks", path: "/tl/tasks" },
      { label: "Members", path: "/tl/members" }
    ],
    CONTRIBUTOR: [
      { label: "Dashboard", path: "/contributor/dashboard" },
      { label: "My Tasks", path: "/contributor/tasks" },
      { label: "Settings", path: "/settings" }
    ],
    ADMIN: [
      { label: "Dashboard", path: "/admin-dashboard" }
    ]
  };

  const menuItems = menuConfig[role] || [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #eee"
        }
      }}
    >
      {/* ======= BRAND HEADER ======= */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid #f0f0f0"
        }}
      >
        {/* Logo Circle */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px"
          }}
        >
          TO
        </Box>

        {/* Brand Name */}
        <Typography variant="h6" fontWeight={600}>
          TaskOrbit
        </Typography>
      </Box>

      {/* ======= MENU ITEMS ======= */}
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 2
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
