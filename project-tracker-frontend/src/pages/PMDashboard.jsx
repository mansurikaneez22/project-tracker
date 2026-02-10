import { Box, Grid, Typography } from "@mui/material";
import StatCard from "../components/dashboard/StatCard";
import TaskOverview from "../components/dashboard/TaskOverview";
import ProjectProgress from "../components/dashboard/ProjectProgress";
import { useEffect, useState } from "react";
import { getPMDashboard } from "../services/pmDashboardApi";

const PMDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getPMDashboard()
      .then(setData)
      .catch((err) => console.error("Error fetching dashboard:", err));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <Box p={3}>
      {/* Dashboard Title */}
      <Typography variant="h4" mb={3}>
        Project Manager Dashboard
      </Typography>

      {/* Top Stat Cards */}
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Projects" value={data.projects || 0} />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Teams" value={data.teams || 0} />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Tasks" value={data.tasks || 0} />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard title="Pending" value={data.pending_tasks || 0} />
        </Grid>
      </Grid>

      {/* Task Overview & Project Progress */}
      <Grid container spacing={3} mt={3}>
        <Grid xs={12} md={6}>
          <TaskOverview data={data.task_status || {}} />
        </Grid>
        <Grid xs={12} md={6}>
          <ProjectProgress projects={data.project_progress || []} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PMDashboard;
