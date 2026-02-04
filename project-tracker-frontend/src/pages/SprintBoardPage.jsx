import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import api from "../services/api";
import KanbanColumn from "../components/KanbanColumn";

const STATUSES = [
  { key: "TODO", label: "To Do" },
  { key: "IN PROGRESS", label: "In Progress" },
  { key: "DONE", label: "Done" }
];

const SprintBoardPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await api.get("/api/v1/task/list");
      setTasks(res.data);
    };
    fetchTasks();
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    setTasks((prev) =>
      prev.map((t) =>
        t.task_id.toString() === draggableId
          ? { ...t, status: newStatus }
          : t
      )
    );

    await api.post(`/api/v1/task/${draggableId}`, {
      status: newStatus
    });
  };

  const tasksByStatus = (status) =>
    tasks.filter((t) => t.status === status);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display="flex" gap={2} p={2}>
        {STATUSES.map((col) => (
          <Box key={col.key} sx={{ minWidth: 320 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              align="center"
              mb={1}
            >
              {col.label}
            </Typography>

            <KanbanColumn
              status={col.key}
              tasks={tasksByStatus(col.key)}
            />
          </Box>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default SprintBoardPage;
