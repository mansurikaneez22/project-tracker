import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Stack,
  Button
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import api from "../services/api"; // axios instance with baseURL

import TaskList from "../pages/TaskList";
import ProjectMembers from "./ProjectMembers";
import SprintTimeline from "./SprintTimeline";
import SprintPage from "../pages/SprintPage";
import SprintBoard from "../pages/SprintBoard";

const ProjectDetail = () => {
  const { currentUser, fetchNotifications } = useContext(NotificationContext);
  const params = useParams();
  const navigate = useNavigate();

  const projectId = params.projectId;
  const deptId = params.deptId;
  const teamId = params.teamId;

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);

  // --- FETCH PROJECT DETAILS ---
  useEffect(() => {
    const fetchProject = async () => {
      try {
        let res;

        if (currentUser?.job_profile === "CONTRIBUTOR") {
          // Contributor: get assigned projects
          const projectsRes = await api.get(
            `api/v1/contributor/${currentUser.user_id}/projects`
          );
          const proj = projectsRes.data.find(
            (p) => p.project_id === parseInt(projectId)
          );
          if (!proj) throw new Error("Not assigned to this project");
          res = { data: proj };
        } else {
          // PM/Manager: scoped API
          res = await api.get(
            `api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}`
          );
        }

        setProject(res.data);
      } catch (err) {
        alert(err.response?.data?.detail || err.message || "Failed to fetch project details");
        console.error(err);
      }
    };
    fetchProject();
  }, [deptId, teamId, projectId, currentUser]);

  // --- EDIT PROJECT ---
  const handleEdit = async () => {
    if (!project) return;
    const newName = prompt("Enter new project name:", project.project_title);
    if (!newName || newName === project.project_title) return;

    setLoading(true);
    try {
      const res = await api.put(
        `api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}`,
        { project_title: newName } // backend expects project_title
      );
      alert(res.data.message);
      setProject({ ...project, project_title: newName });

      // 🔥 Refresh notifications after edit
      if (fetchNotifications) fetchNotifications();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE PROJECT ---
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    try {
      const res = await api.delete(
        `api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}`
      );
      alert(res.data.message);

      // 🔥 Refresh notifications after delete
      if (fetchNotifications) fetchNotifications();

      navigate("/projects"); // redirect to projects list
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  if (!project) return <Typography mt={3}>Loading project details...</Typography>;

  return (
    <Container maxWidth="lg">
      {/* HEADER */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {project.project_title}
        </Typography>
        <Stack direction="row" spacing={1}>
          {currentUser?.user_id === project.project_manager && (
            <Button variant="contained" onClick={handleEdit} disabled={loading}>
              Edit
            </Button>
          )}
          {currentUser?.user_id === project.created_by && (
            <Button variant="outlined" color="error" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
          )}
        </Stack>
      </Box>

      {/* TABS */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mt: 3 }}>
        <Tab label="All Tasks" />
        <Tab label="Sprints" />
        <Tab label="Board" />
        <Tab label="Members" />
        <Tab label="Timeline" />
      </Tabs>

      {/* TAB CONTENT */}
      {tab === 0 && (
        <Box mt={3}>
          <TaskList deptId={deptId} teamId={teamId} projectId={projectId} currentUser={currentUser} />
        </Box>
      )}
      {tab === 1 && (
        <Box mt={3}>
          <SprintPage deptId={deptId} teamId={teamId} projectId={projectId} />
        </Box>
      )}
      {tab === 2 && (
        <Box mt={3}>
          <SprintBoard deptId={deptId} teamId={teamId} projectId={projectId} />
        </Box>
      )}
      {tab === 3 && (
        <Box mt={3}>
          <ProjectMembers deptId={deptId} teamId={teamId} projectId={projectId} />
        </Box>
      )}
      {tab === 4 && (
        <Box mt={3}>
          <SprintTimeline deptId={deptId} teamId={teamId} projectId={projectId} />
        </Box>
      )}
    </Container>
  );
};

export default ProjectDetail;