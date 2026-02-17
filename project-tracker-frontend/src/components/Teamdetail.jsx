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
  <Box sx={{ px: 4, py: 5 }}>

  
    {/* ===== HERO HEADER ===== */}
<Box
  sx={{
    p: 4,
    borderRadius: 4,
    mb: 5,
    background: (theme) =>
      theme.palette.mode === "dark"
        ? `linear-gradient(
            135deg,
            ${theme.palette.primary.main}25,
            #0F172A
          )`
        : `linear-gradient(
            135deg,
            ${theme.palette.primary.main}15,
            #ffffff
          )`,
    border: "1px solid",
    borderColor: "divider",
  }}
>

      <Typography variant="h4" sx={{ mb: 1 }}>
        {team.team_name}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Teams Dashboard
      </Typography>
    </Box>


    {/* ===== STAT CARDS ===== */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 3,
        mb: 5,
      }}
    >
      {/* TEAM ID */}
      <Box
  sx={{
    p: 3,
    borderRadius: 4,
    backgroundColor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
    transition: "all 0.25s ease",
"&:hover": {
  transform: "translateY(-3px)",
  borderColor: "primary.main",

  backgroundColor: (theme) =>
    theme.palette.mode === "dark"
      ? "#1F2A3D"   // solid deeper tone (not white tint)
      : "rgba(0,0,0,0.02)",

  boxShadow: (theme) =>
    theme.palette.mode === "dark"
      ? "0 8px 25px rgba(96,165,250,0.15)"
      : "0 8px 25px rgba(0,0,0,0.08)",
},

  }}
>

        <Typography variant="caption" color="text.secondary">
          TEAM ID
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>
          {team.team_id}
        </Typography>
      </Box>

      {/* STATUS */}
      <Box
  sx={{
    p: 3,
    borderRadius: 4,
    backgroundColor: "background.paper",
    border: "1px solid",
    borderColor: "divider",
    transition: "all 0.25s ease",

    "&:hover": {
  transform: "translateY(-3px)",
  borderColor: "primary.main",

  backgroundColor: (theme) =>
    theme.palette.mode === "dark"
      ? "#1F2A3D"   // solid deeper tone (not white tint)
      : "rgba(0,0,0,0.02)",

  boxShadow: (theme) =>
    theme.palette.mode === "dark"
      ? "0 8px 25px rgba(96,165,250,0.15)"
      : "0 8px 25px rgba(0,0,0,0.08)",
},

  }}
>

        <Typography variant="caption" color="text.secondary">
          STATUS
        </Typography>
        <Typography
          variant="h6"
          sx={{ mt: 1, color: "success.main" }}
        >
          Active
        </Typography>
      </Box>
    </Box>


    {/* ===== CONTENT CONTAINER ===== */}
    <Box
      sx={{
        borderRadius: 4,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{
          px: 3,
          pt: 2,
          borderBottom: "1px solid",
          borderColor: "divider",

          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: 3,
            backgroundColor: "primary.main",
          },

          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            color: "text.secondary",
          },

          "& .Mui-selected": {
            color: "text.primary",
          },
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
