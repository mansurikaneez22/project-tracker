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
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 230;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role")?.trim(); // safety trim
  const theme = useTheme();

  const menuConfig = {
    "PROJECT MANAGER": [
      { label: "Dashboard", path: "/pm/dashboard" },
      { label: "My Tasks", path: "/pm/tasks" },   // PMTasks.jsx route
      { label: "Members", path: "/pm/members" },
      
    ],
    "TEAM LEADER": [
      { label: "Dashboard", path: "/tl/dashboard" },
      { label: "My Tasks", path: "/tl/tasks" },
      { label: "Members", path: "/tl/members" }
    ],
    "CONTRIBUTOR": [
      { label: "Dashboard", path: "/contributor/dashboard" },
      { label: "My Tasks", path: "/my-tasks" },   // Contributor page
    
    ],
    "ADMIN": [
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
          borderRight: `1px solid ${theme.palette.divider}`
        }
      }}
    >
      {/* ===== BRAND HEADER ===== */}
      <Box
        sx={{
          px: 2.5,
          py: 2.2,
          display: "flex",
          alignItems: "center",
          gap: 1.3,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TrackChangesIcon
          sx={{
            fontSize: 30,
            color: theme.palette.primary.main,
          }}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          TaskOrbit
        </Typography>
      </Box>

      {/* ===== MENU ITEMS ===== */}
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