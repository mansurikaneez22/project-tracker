import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import TimelineIcon from "@mui/icons-material/Timeline";
import GroupsIcon from "@mui/icons-material/Groups";

const features = [
  { icon: <ViewKanbanIcon fontSize="large" />, title: "Kanban Boards", desc: "Organize your workflow visually." },
  { icon: <TimelineIcon fontSize="large" />, title: "Timeline View", desc: "Track project delivery deadlines." },
  { icon: <GroupsIcon fontSize="large" />, title: "Team Collaboration", desc: "Stay aligned with your team." },
];

const FeaturesSection = () => {
  console.debug("FeaturesSection rendered");

  return (
    <Box id="features" sx={{ py: 10, px: { xs: 2, md: 4 } }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={6}
        color="text.primary"
      >
        Key Features
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {features.map((item, index) => (
          <Grid item xs={12} md={4} key={index} display="flex" justifyContent="center">
            <Paper
              elevation={2}
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "background.paper",
                color: "text.primary",
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 6,
                  borderColor: "primary.main",
                },
              }}
            >
              <Box
  sx={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: "50%",
    backgroundColor: "primary.main",
    color: "#fff",
    mb: 2,
    transition: "0.3s",
  }}
>
  {React.cloneElement(item.icon, { fontSize: "medium" })}
</Box>
              <Typography variant="h6" fontWeight="bold" mt={2} color="text.primary">
                {item.title}
              </Typography>
              <Typography sx={{ opacity: 0.8, color: "text.secondary" }}>{item.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesSection;
