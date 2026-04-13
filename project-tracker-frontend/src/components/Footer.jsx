import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  console.debug("Footer rendered");

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 4,
        color: "text.secondary", 
        px: 2,                
        width: "100%",            
        display: "flex",
        justifyContent: "center", 
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Project Tracker — All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
