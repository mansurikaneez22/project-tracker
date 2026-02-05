// src/components/Navbar.jsx
import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
  Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();

  // split path for breadcrumb
  const pathnames = location.pathname.split("/").filter(Boolean);

  // hide back on login
  const hideBackOn = ["/", "/login"];
  const showBack = !hideBackOn.includes(location.pathname);

  const buildPath = (index) =>
    "/" + pathnames.slice(0, index + 1).join("/");

  const formatLabel = (segment) => {
    if (/^\d+$/.test(segment)) return null; // hide ids
    return segment.replace(/-/g, " ").toUpperCase();
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
      {/* BACK BUTTON (temporary) */}
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
        <Link
          underline="hover"
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/department")}
        >
          HOME
        </Link>

        {pathnames.map((segment, index) => {
          const label = formatLabel(segment);
          if (!label) return null;

          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <Typography key={index} color="text.primary">
              {label}
            </Typography>
          ) : (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(buildPath(index))}
            >
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
    </Box>
  );
};

export default Navbar;
