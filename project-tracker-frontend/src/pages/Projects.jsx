import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CreateProjectModal from "../components/CreateProjectModal";

const Projects = () => {
  const navigate = useNavigate();
  const { deptId, teamId } = useParams(); // ✅ THIS IS THE KEY


  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [projects, setProjects] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const canAddProject =
    ["PRODUCT MANAGER", "PROJECT MANAGER"].includes(
      user?.job_profile?.toUpperCase()
    );

  /* ================= FETCH PROJECTS ================= */
  const fetchProjects = async () => {
    if (!deptId|| !teamId) return;

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/v1/project/department/${deptId}/team/${teamId}/project`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProjects(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch projects",
        err.response?.data || err
      );
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [deptId, teamId, refresh]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
        Projects
      </Typography>

      {canAddProject && (
        <Box mb={2}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            + Add Project
          </Button>
        </Box>
      )}

      <CreateProjectModal
        open={open}
        onClose={() => setOpen(false)}
        deptId={deptId}
        teamId={teamId}
        onCreated={() => setRefresh((prev) => !prev)}
      />

      {projects.length === 0 ? (
        <Typography>No projects found</Typography>
      ) : (
        projects.map((proj) => (
          <Box
  key={proj.project_id}
  p={3}
  mb={2}
  sx={{
    cursor: "pointer",
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    transition: "all 0.25s ease",

    "&:hover": {
      transform: "translateY(-4px)",
      borderColor: "primary.main",
      backgroundColor: (theme) =>
        theme.palette.mode === "dark"
          ? "#1E293B"   // dark hover
          : "#F8FAFC",  // light hover
      boxShadow: (theme) =>
        theme.palette.mode === "dark"
          ? "0 8px 25px rgba(59,130,246,0.25)"
          : "0 8px 20px rgba(0,0,0,0.08)",
    },
  }}
  onClick={() =>
    navigate(
      `/department/${deptId}/team/${teamId}/project/${proj.project_id}`
    )
  }
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 600,
      color: "text.primary",
      mb: 0.5,
    }}
  >
    {proj.project_title}
  </Typography>

  <Typography
    variant="body2"
    sx={{
      color: (theme) =>
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.75)"
          : "text.secondary",
    }}
  >
    {proj.project_description}
  </Typography>
</Box>

        ))
      )}
    </Container>
  );
};

export default Projects;
