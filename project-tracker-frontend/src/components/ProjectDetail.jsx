import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Tabs,
  Tab
} from "@mui/material";
import { useParams } from "react-router-dom";

import BoardList from "./BoardList";
import CreateBoardModal from "./CreateBoardModal";
import TaskList from "../pages/TaskList";
import ProjectTimeline from "./ProjectTimeline";
import ProjectMembers from "./ProjectMembers";

const ProjectDetail = () => {
  const { projectId } = useParams();

  const [tab, setTab] = useState(0);
  const [openBoardModal, setOpenBoardModal] = useState(false);
  const [refreshBoards, setRefreshBoards] = useState(false);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3 }}>
        Project
      </Typography>

      {/* ================= TABS ================= */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mt: 2 }}>
        <Tab label="All Tasks" />
        <Tab label="Sprint Boards" />
        <Tab label="Members" />
        <Tab label="Timeline" />
      </Tabs>

      {/* ================= ALL TASKS ================= */}
      {tab === 0 && (
        <Box mt={3}>
          <TaskList projectId={projectId} />
        </Box>
      )}

      {/* ================= SPRINT BOARDS ================= */}
      {tab === 1 && (
        <Box mt={3}>
          <Box mb={2}>
            <Button
              variant="contained"
              onClick={() => setOpenBoardModal(true)}
            >
              + Add Sprint
            </Button>
          </Box>

          <CreateBoardModal
            open={openBoardModal}
            onClose={() => setOpenBoardModal(false)}
            projectId={projectId}
            onCreated={() => setRefreshBoards(prev => !prev)}
          />

          <BoardList
            projectId={projectId}
            refresh={refreshBoards}
          />
        </Box>
      )}

      {/* ================= MEMBERS ================= */}
      {tab === 2 && (
        <Box mt={3}>
          <ProjectMembers projectId={projectId} />
        </Box>
      )}

      {/* ================= TIMELINE ================= */}
      {tab === 3 && (
        <Box mt={3}>
          <ProjectTimeline projectId={projectId} />
        </Box>
      )}
    </Container>
  );
};

export default ProjectDetail;
