import { Card, CardContent, Typography, Box, LinearProgress } from "@mui/material";

const ProjectProgress = ({ projects }) => {
  return (
    <Card sx={{ borderRadius: 3, width: "100%", minHeight: 180 }}>
      <CardContent>
        <Typography fontWeight={600} mb={2}>
          Project Progress
        </Typography>

        {projects.length === 0 ? (
          <Typography>No projects yet</Typography>
        ) : (
          projects.map((project) => (
            <Box key={project.project_id} mb={2}>
              <Typography>{project.project_name}</Typography>
              <LinearProgress
                variant="determinate"
                value={project.progress || 0}
                sx={{ height: 10, borderRadius: 5, mt: 0.5 }}
              />
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectProgress;
