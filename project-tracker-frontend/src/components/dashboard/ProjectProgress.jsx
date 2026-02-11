import React from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Stack,
  Paper
} from "@mui/material";

const ProjectProgress = ({ projects }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        height: "100%",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Project Progress
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Completion status of active projects
      </Typography>

      <Stack spacing={2}>
        {projects.slice(0, 6).map((project) => (
          <Box key={project.project_id}>
            <Box
              display="flex"
              justifyContent="space-between"
              mb={0.5}
            >
              <Typography variant="body2" fontWeight={500}>
                {project.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {project.progress}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={project.progress}
              sx={{
                height: 8,
                borderRadius: 10,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 10
                }
              }}
            />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default ProjectProgress;
