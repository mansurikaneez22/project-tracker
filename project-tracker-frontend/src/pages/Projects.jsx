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
            p={2}
            mb={1}
            border="1px solid #ddd"
            borderRadius={1}
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f5f5f5" }
            }}
            onClick={() =>
              navigate(
                `/department/${deptId}/team/${teamId}/project/${proj.project_id}`
              )
            }
          >
            <Typography fontWeight={600}>
              {proj.project_title}
            </Typography>
            <Typography variant="body2">
              {proj.project_description}
            </Typography>
          </Box>
        ))
      )}
    </Container>
  );
};

export default Projects;
