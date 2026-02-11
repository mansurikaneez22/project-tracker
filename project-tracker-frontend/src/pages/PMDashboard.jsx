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
    <Box sx={{ backgroundColor: "#f5f7fb", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: "1400px", margin: "0 auto", px: 3 }}>
        {/* Header */}
        <Typography variant="h4" fontWeight={600}>
          Project Manager Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Your assigned projects overview
        </Typography>

        {/* ================= PROJECT CARDS ================= */}
        <Typography variant="h6" fontWeight={600} mb={3}>
          Your Projects
        </Typography>

        <Grid container spacing={3} mb={5}>
          {(data.project_progress || []).slice(0, 6).map((project, index) => {
            const progressValue = Number(project?.progress ?? 0);
            const title = project?.project_name?.trim() || `Project ${index + 1}`;

            return (
              <Grid item xs={12} sm={6} md={4} key={project?.project_id || index}>
                <Box
                  onClick={() =>
                    navigate(
                      `/department/${project.deptId}/team/${project.team_id}/project/${project.project_id}`
                    )
                  }
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: 3,
                    p: 3,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} mb={2}>
                    {title}
                  </Typography>

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Completion
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {progressValue}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                      height: 8,
                      borderRadius: 10,
                      backgroundColor: "#f1f3f6",
                      "& .MuiLinearProgress-bar": { borderRadius: 10 },
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* ================= LOWER DASHBOARD SECTION ================= */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TaskOverview
              todo={data.task_status?.TODO || 0}
              inProgress={data.task_status?.IN_PROGRESS || 0}
              done={data.task_status?.DONE || 0}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <ActivityFeed />
          </Grid>

          <Grid item xs={12} md={3}>
            <TeamWorkload data={teamWorkload} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PMDashboard;
