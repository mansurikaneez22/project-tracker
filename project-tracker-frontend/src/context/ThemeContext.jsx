// src/context/ThemeContext.jsx
import React, { createContext, useState, useMemo, useContext } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light"); // default light mode

  const toggleTheme = () => {
    setMode(prev => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => {
    const isDark = mode === "dark";

    return createTheme({
      palette: {
        mode,
        ...(isDark
          ? {
              background: {
                default: "#121212", // page background
                paper: "#1E1E1E",   // card/paper background
              },
              primary: {
                main: "#1976d2",    // buttons, inputs
              },
              text: {
                primary: "#ffffff",
                secondary: "#aaaaaa",
              },
            }
          : {
              background: {
                default: "#f5f5f5",
                paper: "#fff",
              },
              primary: {
                main: "#1976d2",
              },
              text: {
                primary: "#000000",
                secondary: "#555555",
              },
            }),
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: "8px",       // nice rounded cards
              padding: "16px",           // consistent padding
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? "#1E1E1E" : "#fff",
              borderRadius: "4px",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              color: "#fff",
              textTransform: "none",      // optional: remove uppercase
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
