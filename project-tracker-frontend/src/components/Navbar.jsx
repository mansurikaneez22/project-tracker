import React from "react";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <header style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
      <IconButton onClick={toggleTheme}>
        {mode === "light" ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </header>
  );
};

export default Navbar; 