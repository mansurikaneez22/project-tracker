import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import api from "../services/api";
import { COLUMNS } from "../constants/status";

const KanbanBoard = ({ boardId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (boardId) fetchTasks();
  }, [boardId]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(
        `/api/v1/board_task_mapping/board/${boardId}/task`
      );
      setTasks(res.data || []);
    } catch (err) {
      console.error("Fetch tasks failed", err);
    }
  };

  const groupedTasks = {
    TODO: tasks.filter(t => t.status === "TODO"),
    IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS"),
    DONE: tasks.filter(t => t.status === "DONE")
  };

  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    // 🔹 Optimistic UI
    setTasks(prev =>
      prev.map(task =>
        task.task_id.toString() === draggableId
          ? { ...task, status: destination.droppableId }
          : task
      )
    );

    try {
      await api.patch(`/api/v1/task/${draggableId}/status`, {
        status: destination.droppableId
      });
    } catch (err) {
      console.error("Status update failed", err);
      fetchTasks(); // rollback
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container spacing={2}>
        {COLUMNS.map(status => (
          <Grid item xs={12} md={4} key={status}>
            <Typography variant="h6" mb={1}>
              {status.replace("_", " ")}
            </Typography>

            <KanbanColumn status={status} tasks={groupedTasks[status]} />
          </Grid>
        ))}
      </Grid>
    </DragDropContext>
  );
};

export default KanbanBoard;
