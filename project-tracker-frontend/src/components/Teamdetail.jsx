import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Typography, Tabs, Tab, Paper
} from "@mui/material";
import api from "../services/api";
import Projects from "../pages/Projects";
import TeamMembers from "./TeamMembers";

const TeamDetail = () => {
  const { deptId, teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    // Fetch team info including projects
    api.get(`/api/v1/department/${deptId}/team`)
      .then((res) => {
        const t = res.data.find(t => t.team_id === Number(teamId));
        setTeam(t || null);
      })
      .catch(err => console.error(err));
  }, [deptId, teamId]);

  if (!team) return <Typography>Loading team...</Typography>;

  // Default to first project for members tab
  const projectId = team.projects?.[0]?.project_id;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        {team.team_name}
      </Typography>

      {/* Team Info */}
      <Box display="flex" gap={2} mb={3}>
        <Paper sx={{ flex: 1, p: 2, boxShadow: 3 }}>
          <Typography variant="body2">Team ID</Typography>
          <Typography variant="h6">{team.team_id}</Typography>
        </Paper>
        <Paper sx={{ flex: 1, p: 2, boxShadow: 3 }}>
          <Typography variant="body2">Status</Typography>
          <Typography variant="h6">Active</Typography>
        </Paper>
      </Box>

      {/* Tabs */}
      <Paper sx={{ boxShadow: 3 }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Projects" />
          <Tab label="Members" />
        </Tabs>

        <Box p={3}>
          {tab === 0 && (
  <Projects 
    deptId={deptId}
    teamId={teamId}
  />
)}

          {tab === 1 && projectId && (
            <TeamMembers 
              deptId={deptId} 
              teamId={teamId} 
              projectId={projectId} 
            />
          )}
          {tab === 1 && !projectId && (
            <Typography>No project selected for members</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default TeamDetail;
