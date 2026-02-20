import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const steps = [
  { number: "01", title: "Create Project", desc: "Set up your workspace quickly." },
  { number: "02", title: "Add Tasks", desc: "Assign, prioritize and schedule work." },
  { number: "03", title: "Track Performance", desc: "Monitor team progress in real time." },
];

const HowItWorksSection = () => {
  console.debug("HowItWorksSection rendered");
  const theme = useTheme();

  return (
    <Box id="how"
     sx={{ py: 10,
     px: { xs: 2, md: 4 },
    background:
       theme.palette.mode === "dark"
       ? "linear-gradient(180deg, #0f172a 0%, #0b1220 100% )" 
       : theme.palette.grey[100],
    }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={6}
        color="text.primary"
      >
        How It Works
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {steps.map((s, index) => (
          <Grid
            item
            xs={12}
            md={4}
            key={index}
            display="flex"
            justifyContent="center"
          >
            <Paper
              elevation={theme.palette.mode === "dark" ? 1 : 3}
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "background.paper",
                color: "text.primary",
                borderRadius: 3,
                transition: "all 0.3s ease",
                border:
                  theme.palette.mode === "dark"
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "1px solid rgba(0,0,0,0.05)",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 6,
                  borderColor: "primary.main",
                },
              }}
            >
              {/* Step Number */}
              <Typography
                variant="h3"
                fontWeight="bold"
                color="primary.main"
                sx={{
                  opacity: 0.8,
                  mb: 1,
                  transition: "0.3s",
                  "&:hover": { opacity: 1, scale: 1.1 },
                }}
              >
                {s.number}
              </Typography>

              {/* Step Title */}
              <Typography
                variant="h6"
                fontWeight="bold"
                mt={1}
                color="text.primary"
              >
                {s.title}
              </Typography>

              {/* Step Description */}
              <Typography sx={{ opacity: 0.8, color: "text.secondary", mt: 1 }}>
                {s.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorksSection;
