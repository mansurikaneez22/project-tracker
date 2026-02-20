import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const stats = [
  { value: "12K+", label: "Projects Completed" },
  { value: "250K+", label: "Tasks Managed" },
  { value: "180+", label: "Teams Onboarded" },
  { value: "4.9★", label: "User Rating" },
];

const StatsSection = () => {
  console.debug("StatsSection rendered");
  const theme = useTheme();
  return (
    <Box id="stats" sx={{ py: 10, px: { xs: 2, md: 4 } }}>
      <Grid container spacing={4} justifyContent="center">
        {stats.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={index}
            display="flex"
            justifyContent="center"
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: theme.palette.mode === "dark"
    ? "rgba(255,255,255,0.05)"
    : "rgba(0,0,0,0.03)",
                borderRadius: 3,
                backdropFilter: "blur(10px)",
                border: theme.palette.mode === "dark"
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 0 20px rgba(66, 165, 245, 0.4)",
                },
              }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                color="primary.main"
                sx={{
                  mb: 1,
                  transition: "0.3s",
                  "&:hover": { opacity: 1, scale: 1.1 },
                }}
              >
                {item.value}
              </Typography>
              <Typography sx={{ opacity: 0.8, color: "text.secondary" }}>
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatsSection;
