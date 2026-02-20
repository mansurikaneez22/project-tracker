import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const HeroSection = () => {
   const theme = useTheme();

   const image =
      theme.palette.mode === "dark"
      ? "/dashboard-dark.png"
      : "/dashboard-light.png";

    return (
  <Box
    sx={{
      py: 10,
      px: { xs: 2, md: 4 },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    {/* Heading */}
    <Typography
      variant="h2"
      fontWeight="bold"
      color="text.primary"
      sx={{ mb: 2 }}
    >
      Track Projects • Assign Tasks • Deliver Faster
    </Typography>

    {/* Subheading */}
    <Typography
      variant="h6"
      color="text.secondary"
      sx={{ mb: 4, maxWidth: 600 }}
    >
      A smart project tracker with dashboards, boards, and collaboration tools.
    </Typography>

    {/* Single Button */}
    <Button
      component={Link}
      to="/login"
      variant="contained"
      size="large"
      color="primary"
      sx={{
        px: 5,
        py: 1.5,
        borderRadius: 3,
        fontWeight: 600,
        fontSize: "16px",
        mb: 6,
      }}
    >
      Get Started
    </Button>

    {/* Dashboard Image */}
    <Typography
      variant="h5"
      fontWeight="bold"
      sx={{ mb: 3, mt: 6}}
      >
        Dashboard Preview
        </Typography>
    <Box
      component="img"
      src={image}
      alt="Dashboard Preview"
      sx={{
        width: "100%",
        maxWidth: 1100,
        borderRadius: 4,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 30px 80px rgba(0,0,0,0.6)"
            : "0 30px 80px rgba(0,0,0,0.15)",
      }}
    />
  </Box>
);
};

export default HeroSection;
