// src/components/Navbar.jsx
import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();

  // no back button on these pages
  const hideBackOn = ["/", "/login",];
  const showBack = !hideBackOn.includes(location.pathname);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        py: 1,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/*  BACK BUTTON */}
      <Box>
        {showBack && (
          <Tooltip title="Go Back">
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default,
                boxShadow: 2,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* THEME TOGGLE */}
      <Tooltip title="Toggle theme">
        <IconButton
          onClick={toggleTheme}
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.default,
            boxShadow: 2,
            "&:hover": {
              backgroundColor: theme.palette.secondary.main,
              color: "#000",
            },
          }}
        >
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Navbar;
