import React, { useState, useContext } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
  Typography,
  Menu,
  MenuItem
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { Brightness4, Brightness7, AccountCircle } from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from "../context/ThemeContext";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({ currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();

  const [anchorEl, setAnchorEl] = useState(null);

  // Profile dropdown
  const open = Boolean(anchorEl);
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Breadcrumbs
  const pathnames = location.pathname.split("/").filter(Boolean);
  const hideBackOn = ["/", "/login"];
  const showBack = !hideBackOn.includes(location.pathname);
  const buildPath = (index) => "/" + pathnames.slice(0, index + 1).join("/");
  const formatLabel = (segment) => {
    if (/^\d+$/.test(segment)) return null;
    if (segment === "department") return location.state?.departmentName || "DEPARTMENT";
    if (segment === "team") return location.state?.teamName || "TEAM";
    if (segment === "project") return location.state?.projectName || "PROJECT";
    if (segment === "task") return "TASK";
    return segment.toUpperCase();
  };

  const handleMenuClick = (route) => {
    handleClose();
    navigate(route);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: 1,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      {/* BACK BUTTON */}
      {showBack && (
        <Tooltip title="Go Back">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* BREADCRUMBS */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ flexGrow: 1 }}
      >
        {location.pathname === "/" && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <TrackChangesIcon sx={{ fontSize: 26, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5, color: theme.palette.text.primary }}>
              TaskOrbit
            </Typography>
          </Box>
        )}

        {pathnames.map((segment, index) => {
          const label = formatLabel(segment);
          if (!label) return null;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Typography key={index} color="text.primary">{label}</Typography>
          ) : (
            <Link key={index} underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => navigate(buildPath(index))}>
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>

      {/* THEME TOGGLE */}
      <Tooltip title="Toggle theme">
        <IconButton onClick={toggleTheme}>
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Tooltip>

      {/* NOTIFICATION DROPDOWN */}
      <NotificationDropdown />

      {/* PROFILE ICON & DROPDOWN */}
      <Tooltip title="Profile">
        <IconButton onClick={handleProfileClick}>
          <AccountCircle fontSize="large" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleMenuClick("/account")}>Profile</MenuItem>
        <MenuItem onClick={() => handleMenuClick("/settings")}>Settings</MenuItem>
        <MenuItem
          onClick={() => {
            localStorage.clear();
            handleMenuClick("/login");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Navbar;