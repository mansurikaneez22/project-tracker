import { Box, Grid, Typography, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TaskOverview from "../components/dashboard/TaskOverview";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import TeamWorkload from "../components/dashboard/TeamWorkload";
import { getPMDashboard } from "../services/pmDashboardApi";
import api from "../services/api";

const PMDashboard = () => {
  const [data, setData] = useState(null);
  const [teamWorkload, setTeamWorkload] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch PM Dashboard
    getPMDashboard()
      .then((res) => {
        console.log("Dashboard data:", res);
        console.log("Project Progress Array:", res.project_progress);
        setData(res);
      })
      .catch((err) => console.error("Error fetching PM dashboard:", err));

    // Fetch Team Workload
    api
      .get("/api/v1/pm/team/workload")
      .then((res) => {
        const formatted = (res.data || []).map((row) => ({
          name: row.name,
          tasks: Number(row.tasks) || 0,
        }));
        console.log("TeamWorkload Props:", formatted);
        setTeamWorkload(formatted);
      })
      .catch((err) => console.error("Error fetching team workload:", err));
  }, []);

  if (!data) {
    return (
      <Box p={3}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }
return (
  <Box
    sx={{
      minHeight: "100vh",
      py: 6,
      background:
        "linear-gradient(to bottom, rgba(0,0,0,0.02), transparent 40%)",
    }}
  >
    <Box
      sx={{
        maxWidth: "1300px",
        mx: "auto",
        px: { xs: 2, md: 4 },
      }}
    >
      {/* ================= HEADER ================= */}
      <Box mb={6}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          Project Manager Dashboard
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mt: 1 }}
        >
          Overview of your assigned projects and team performance
        </Typography>
      </Box>

      {/* ================= PROJECT SECTION ================= */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 3,
        }}
      >
        Your Projects
      </Typography>

      <Grid container spacing={4} mb={8}>
        {(data.project_progress || []).slice(0, 6).map((project, index) => {
          const progressValue = Number(project?.progress ?? 0);
          const title =
            project?.project_name?.trim() || `Project ${index + 1}`;

          return (
            <Grid item xs={12} sm={6} md={4} key={project?.project_id || index}>
              <Box
                onClick={() =>
                  navigate(
                    `/department/${project.deptId}/team/${project.team_id}/project/${project.project_id}`
                  )
                }
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 4,
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.25s ease",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "primary.main",
                    boxShadow: "0 14px 35px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  {title}
                </Typography>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  mb={1.5}
                >
                  <Typography variant="body2" color="text.secondary">
                    Completion
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="primary.main"
                  >
                    {progressValue}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{
                    height: 8,
                    borderRadius: 8,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "#1E293B"
                        : "#F1F5F9",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 8,
                    },
                  }}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* ================= LOWER SECTION ================= */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          pt: 6,
        }}
      >
        <Grid container spacing={4}>
  {/* Top Row */}
  <Grid item xs={12} md={6} sx={{ display: "flex" }}>
    <TaskOverview
      todo={data.task_status?.TODO || 0}
      inProgress={data.task_status?.IN_PROGRESS || 0}
      done={data.task_status?.DONE || 0}
    />
  </Grid>

  <Grid item xs={12} md={6} sx={{ display: "flex" }}>
    <TeamWorkload data={teamWorkload} />
  </Grid>

  {/* Bottom Row - Full Width */}
  <Grid item xs={12} sx={{ display: "flex" }}>
    <ActivityFeed />
  </Grid>
</Grid>
      </Box>
    </Box>
  </Box>
);

};

export default PMDashboard;
