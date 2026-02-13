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
  <Box sx={{ px: 4, py: 4 }}>

    {/* ===== HERO HEADER ===== */}
    <Box
      sx={{
        p: 4,
        borderRadius: 4,
        mb: 4,
        background: "linear-gradient(135deg, #6366F1, #4F46E5)",
        color: "white",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Typography variant="h4" fontWeight={700}>
        {team.team_name}
      </Typography>

      <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
        Team Management Dashboard
      </Typography>

      {/* Decorative circle */}
      <Box
        sx={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)"
        }}
      />
    </Box>


    {/* ===== STAT CARDS ===== */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 3,
        mb: 4,
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          backgroundColor: "#111827",
          color: "white",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          TEAM ID
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {team.team_id}
        </Typography>
      </Box>

      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          backgroundColor: "#F3F4F6",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          STATUS
        </Typography>
        <Typography variant="h5" fontWeight={600} color="success.main">
          Active
        </Typography>
      </Box>
    </Box>


    {/* ===== CONTENT CONTAINER ===== */}
    <Box
      sx={{
        borderRadius: 4,
        backgroundColor: "background.paper",
        boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
        overflow: "hidden"
      }}
    >
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{
          px: 3,
          pt: 2,
          "& .MuiTabs-indicator": {
            height: 4,
            borderRadius: 4,
            backgroundColor: "#6366F1"
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
          }
        }}
      >
        <Tab label="Projects" />
        <Tab label="Members" />
      </Tabs>

      <Box sx={{ p: 4 }}>
        {tab === 0 && (
          <Projects deptId={deptId} teamId={teamId} />
        )}

        {tab === 1 && projectId && (
          <TeamMembers
            deptId={deptId}
            teamId={teamId}
            projectId={projectId}
          />
        )}

        {tab === 1 && !projectId && (
          <Typography color="text.secondary">
            No project selected for members
          </Typography>
        )}
      </Box>
    </Box>

  </Box>
);


};

export default TeamDetail;
