// src/context/ThemeContext.jsx
import React, { createContext, useState, useMemo, useContext } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => {
    setMode(prev => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
  () =>
    createTheme({
      palette: {
        mode,

        primary: { main: "#9AC1F0" },
        secondary: { main: "#A0E548" },
        success: { main: "#72FA93" },
        warning: { main: "#E45F2B" },
        info: { main: "#F6C445" },

        background: {
          default: mode === "light" ? "#F4F7FB" : "#0F1115",
          paper: mode === "light" ? "#FFFFFF" : "#1A1D23",
        },

        divider: mode === "light" ? "#E6EAF0" : "#2A2F3A",
      },

      shape: {
        borderRadius: 16,
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
            root: {
              borderRadius: 18,
              border: "1px solid",
              borderColor:
                mode === "light" ? "#E6EAF0" : "#2A2F3A",
              boxShadow:
                mode === "light"
                  ? "0 4px 12px rgba(0,0,0,0.04)"
                  : "0 4px 12px rgba(0,0,0,0.3)",
              transition: "all 0.25s ease",

              "&:hover": {
                boxShadow:
                  mode === "light"
                    ? "0 8px 24px rgba(0,0,0,0.08)"
                    : "0 8px 24px rgba(0,0,0,0.4)",
              },
            },
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
              color: mode === "light" ? "#5B6472" : "#AAB4C3",
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
    throw new Error("useThemeContext must be used inside ThemeProvider");
  }
  return context;
};
