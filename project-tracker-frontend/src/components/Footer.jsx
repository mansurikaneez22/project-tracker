import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  console.debug("Footer rendered");

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 4,
        color: "text.secondary",  // theme-aware text
        px: 2,                    // small padding so content isn't too close to edges
        width: "100%",             // full width
        display: "flex",
        justifyContent: "center",  // horizontally center
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Project Tracker — All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
