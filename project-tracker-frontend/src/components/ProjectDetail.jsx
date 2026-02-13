import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab
} from "@mui/material";
import { useParams } from "react-router-dom";

import TaskList from "../pages/TaskList";
import ProjectMembers from "./ProjectMembers";
import SprintTimeline from "./SprintTimeline";
import SprintPage from "../pages/SprintPage"; // ✅ renamed
import SprintBoard from "../pages/SprintBoard";


const ProjectDetail = () => {
  const { deptId, teamId, projectId } = useParams();
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 3, fontWeight: 600 }}>
        Project Details
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ mt: 3 }}
      >
        <Tab label="All Tasks" />
        <Tab label="Sprints" />
        <Tab label="Board"/>
        <Tab label="Members" />
        <Tab label="Timeline" />
      </Tabs>

      {/* ALL TASKS */}
      {tab === 0 && (
        <Box mt={3}>
          <TaskList
            deptId={deptId}
            teamId={teamId}
            projectId={projectId}
          />
        </Box>
      )}

      {/* SPRINT PAGE */}
      {tab === 1 && (
        <Box mt={3}>
          <SprintPage
            deptId={deptId}
            teamId={teamId}
            projectId={projectId}
          />
        </Box>
      )}

      {tab === 2 && (
  <Box mt={3}>
    <SprintBoard
      deptId={deptId}
      teamId={teamId}
      projectId={projectId}
    />
  </Box>
)}

      {/* MEMBERS */}
      {tab === 3 && (
        <Box mt={3}>
          <ProjectMembers
            deptId={deptId}
            teamId={teamId}
            projectId={projectId}
          />
        </Box>
      )}

      {/* TIMELINE */}
      {tab === 4 && (
        <Box mt={3}>
          <SprintTimeline
            deptId={deptId}
            teamId={teamId}
            projectId={projectId}
          />
        </Box>
      )}
    </Container>
  );
};

export default ProjectDetail;
