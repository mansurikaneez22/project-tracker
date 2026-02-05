import { Box, Typography } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import KanbanColumn from "../components/KanbanColumn";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

const SprintBoard = () => {
  const { boardId } = useParams();
  const [tasks, setTasks] = useState([]);

  /* ---------- Fetch tasks ---------- */
  useEffect(() => {
    if (!boardId) return;

    api
      .get(`/api/v1/board_task_mapping/board/${boardId}/task`)
      .then((res) => {
        setTasks(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setTasks([]));
  }, [boardId]);

  /* ---------- Drag handler ---------- */
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;

    // 🔥 UI update
    setTasks((prev) =>
      prev.map((task) =>
        task.task_id.toString() === draggableId
          ? { ...task, status: newStatus }
          : task
      )
    );

    // 🔥 Backend update
    try {
      await api.patch(`/api/v1/task/${draggableId}/status`, {
        status: newStatus
      });
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Sprint Kanban Board
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box display="flex" gap={2}>
          {STATUSES.map((status) => (
            <Box key={status} flex={1}>
              <Typography fontWeight={700} mb={1}>
                {status.replace("_", " ")} (
                {tasks.filter((t) => t.status === status).length})
              </Typography>

              <KanbanColumn
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
              />
            </Box>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default SprintBoard;
