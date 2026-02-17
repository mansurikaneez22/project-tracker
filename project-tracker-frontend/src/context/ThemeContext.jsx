// src/context/ThemeContext.jsx

import React, { createContext, useState, useMemo, useContext } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          /* ========= BRAND ACCENTS ========= */
          primary: {main: mode === "light" ? "#3B82F6" : "#60A5FA"},
          success: { main: "#72FA93" }, // mint
          info: { main: "#A0E548" }, // lime growth
          warning: { main: "#F6C445" }, // mustard
          error: { main: "#E45F2B" }, // orange risk

          /* ========= SURFACES ========= */
          background: {
            default: mode === "light" ? "#F8FAFC" : "#0F172A",
            paper: mode === "light" ? "#FFFFFF" : "#1B2433",
          },

          divider: mode === "light" ? "#E2E8F0" : "#334155",

          text: {
            primary: mode === "light" ? "#0F172A" : "#F1F5F9",
            secondary: mode === "light" ? "#64748B" : "#94A3B8",
          },
        },

        shape: {
          borderRadius: 14,
        },

        typography: {
          fontFamily: "'Inter', sans-serif",

          h5: {
            fontWeight: 600,
            letterSpacing: "-0.5px",
          },

          h6: {
            fontWeight: 600,
          },

          body1: {
            fontSize: "0.95rem",
          },

          button: {
            textTransform: "none",
            fontWeight: 600,
          },
        },

        components: {
          MuiCard: {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: 18,
      border: "1px solid",
      borderColor: theme.palette.divider,

      boxShadow:
        theme.palette.mode === "light"
          ? "0 2px 8px rgba(0,0,0,0.04)"
          : "0 2px 8px rgba(0,0,0,0.35)",

      transition: "all 0.25s ease",

      "&:hover": {
        transform: "translateY(-3px)",
        borderColor: theme.palette.primary.main,

        boxShadow:
          theme.palette.mode === "light"
            ? "0 6px 18px rgba(0,0,0,0.08)"
            : "0 4px 14px rgba(0,0,0,0.4)",
      },
    }),
  },
},


          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                padding: "8px 18px",
              },
            },
          },

          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                borderRadius: 8,
              },
            },
          },

          MuiTableCell: {
            styleOverrides: {
              head: {
                fontWeight: 600,
                fontSize: "0.85rem",
                color:
                  mode === "light" ? "#64748B" : "#94A3B8",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useThemeContext must be used inside ThemeProvider"
    );
  }
  return context;
};
