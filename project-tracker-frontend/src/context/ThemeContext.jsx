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

          //  PALETTE
          primary: { main: "#9AC1F0" },
          secondary: { main: "#72FA93" },
          success: { main: "#A0E548" },
          warning: { main: "#E45F2B" },
          info: { main: "#F6C445" },

          background: {
            default: mode === "light" ? "#F8F6F4" : "#0F1115",
            paper: mode === "light" ? "#FFFFFF" : "#1A1D23",
          },
        },

        shape: {
          borderRadius: 14,
        },

        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                transition: "all 0.3s ease",
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
