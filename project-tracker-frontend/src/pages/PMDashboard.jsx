import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import FolderIcon from "@mui/icons-material/Folder";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import StatCard from "../components/dashboard/StatCard";
import TaskOverview from "../components/dashboard/TaskOverview";
import ProjectProgress from "../components/dashboard/ProjectProgress";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import TeamWorkload from "../components/dashboard/TeamWorkload";
import api from "../services/api";


import { getPMDashboard } from "../services/pmDashboardApi";

const PMDashboard = () => {
  const [data, setData] = useState(null);
  const [teamWorkload, setTeamWorkload] = useState([]);

  useEffect(() => {
  // PM dashboard summary
  getPMDashboard()
    .then(setData)
    .catch((err) =>
      console.error("Error fetching PM dashboard:", err)
    );

  // Team workload
  api
    .get("/api/v1/pm/team/workload")
    .then((res) => {
      const formatted = res.data.map((row) => ({
        name: row.user_name,          // 👈 IMPORTANT
        tasks: Number(row.task_count) // 👈 IMPORTANT
      }));
      setTeamWorkload(formatted);
    })
    .catch((err) =>
      console.error("Error fetching team workload:", err)
    );
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
      p={3}
      sx={{
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Typography variant="h4" fontWeight={600}>
        Project Manager Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Overview of projects, teams and task progress
      </Typography>

      {/* Stat Cards */}
<Grid container spacing={3} mb={3}>

  <Grid item xs={12} sm={6} md={3}>
    <StatCard
      title="Projects"
      value={data.projects || 0}
      icon={<FolderIcon />}
      color="#5b7cfa"
    />
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <StatCard
      title="Teams"
      value={data.teams || 0}
      icon={<GroupsIcon />}
      color="#00b894"
    />
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <StatCard
      title="Tasks"
      value={data.tasks || 0}
      icon={<AssignmentIcon />}
      color="#f9a825"
    />
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <StatCard
      title="Pending"
      value={data.pending_tasks || 0}
      icon={<PendingActionsIcon />}
      color="#e17055"
    />
  </Grid>

</Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* LEFT */}
        <Grid item xs={12} md={4}>
          <TaskOverview
            todo={data.task_status?.TODO || 0}
            inProgress={data.task_status?.IN_PROGRESS || 0}
            done={data.task_status?.DONE || 0}
          />
        </Grid>

        {/* MIDDLE */}
        <Grid item xs={12} md={4}>
          <ProjectProgress
            projects={data.project_progress || []}
          />
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={4}>
          <ActivityFeed />
        </Grid>

        <Grid item xs={12} md={6}>
    <TeamWorkload data={teamWorkload} />
  </Grid> 
      </Grid>
    </Box>
  );
};

export default PMDashboard;
