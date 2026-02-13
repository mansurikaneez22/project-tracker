// ✅ SprintBoard.jsx (KANBAN BOARD FOR ACTIVE SPRINT)

import { Box, Typography } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import KanbanColumn from "../components/KanbanColumn";

const STATUSES = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];

const normalizeStatus = (status) => {
  if (!status) return "TODO";

  return status
    .toString()
    .trim()
    .replace(/[-\s]+/g, "_")
    .toUpperCase();
};

const SprintBoard = () => {
  const { deptId, teamId, projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [activeSprint, setActiveSprint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch all sprints
        // 1️⃣ Fetch all sprints
const sprintRes = await api.get(
  `/api/v1/project/${projectId}/sprints`
);

const active = sprintRes.data.find(
  (s) =>
    s.status?.trim().toUpperCase() === "ACTIVE"
);

if (!active) {
  setActiveSprint(null);
  setTasks([]);
  setLoading(false);
  return;
}

setActiveSprint(active);


        // 2️⃣ Fetch tasks of active sprint
        const taskRes = await api.get(
          `/api/v1/project/${projectId}/sprints/${active.sprint_id}/tasks`
        );

        const normalizedTasks = Array.isArray(taskRes.data)
          ? taskRes.data.map((t) => ({
              ...t,
              status: normalizeStatus(t.status),
            }))
          : [];

        setTasks(normalizedTasks);
      } catch (err) {
        console.error("Error loading board", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchBoardData();
  }, [projectId]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.task_id.toString() === draggableId
          ? { ...task, status: newStatus }
          : task
      )
    );

    try {
      await api.patch(`/api/v1/task/${draggableId}/status`, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  // 🔹 Loading State
  if (loading) {
    return (
      <Box p={3}>
        <Typography>Loading board...</Typography>
      </Box>
    );
  }

  // 🔹 No Active Sprint
  if (!activeSprint) {
    return (
      <Box p={3}>
        <Typography variant="h6" fontWeight={600}>
          No Active Sprint
        </Typography>
        <Typography color="text.secondary">
          Please start a sprint from the Sprint tab.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={1}>
        {activeSprint.sprint_name}
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Active Sprint Board
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box display="flex" gap={2}>
          {STATUSES.map((status) => {
            const columnTasks = tasks.filter(
              (t) => t.status === status
            );

            return (
              <Box key={status} flex={1}>
                <Typography fontWeight={700} mb={1}>
                  {status.replace("_", " ")} ({columnTasks.length})
                </Typography>

                <KanbanColumn
                  status={status}
                  tasks={columnTasks}
                  deptId={deptId}
                  teamId={teamId}
                  projectId={projectId}
                />
              </Box>
            );
          })}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default SprintBoard;
