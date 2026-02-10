import { Box, Typography } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import KanbanColumn from "../components/KanbanColumn";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

// 🔥 STRONG STATUS NORMALIZER
const normalizeStatus = (status) => {
  if (!status) return "TODO";

  return status
    .toString()
    .trim()
    .replace(/[-\s]+/g, "_")
    .toUpperCase();
};

const SprintBoard = () => {
  const { deptId, teamId, projectId, boardId } = useParams();
  
  const [tasks, setTasks] = useState([]);
  console.log("SPRINT PARAMS >>>", {
  deptId,
  teamId,
  projectId,
  boardId
});

  useEffect(() => {
    if (!boardId) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get(
          `/api/v1/board_task_mapping/board/${boardId}/task`
        );

        const normalizedTasks = Array.isArray(res.data)
          ? res.data.map((t) => ({
              ...t,
              status: normalizeStatus(t.status),
            }))
          : [];

        console.log(
          "NORMALIZED TASK STATUSES >>>",
          normalizedTasks.map((t) => t.status)
        );

        setTasks(normalizedTasks);
      } catch (err) {
        console.error("Error fetching tasks", err);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [boardId]);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;

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

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Sprint Kanban Board
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
