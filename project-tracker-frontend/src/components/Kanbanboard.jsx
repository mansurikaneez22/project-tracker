import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import api from "../services/api";

const COLUMNS = ["TODO", "IN PROGRESS", "DONE"];

const KanbanBoard = ({ boardId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [boardId]);

  const fetchTasks = async () => {
    const res = await api.get(
      `/api/v1/board_task_mapping/board/${boardId}/task`
    );
    setTasks(res.data || []);
  };

  const groupedTasks = {
    TODO: tasks.filter(t => t.status === "TODO"),
    "IN PROGRESS": tasks.filter(t => t.status === "IN PROGRESS"),
    DONE: tasks.filter(t => t.status === "DONE")
  };

  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    await api.post(`/api/v1/task/${draggableId}`, {
      status: destination.droppableId
    });

    fetchTasks();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container spacing={2}>
        {COLUMNS.map(status => (
          <Grid item xs={12} md={4} key={status}>
            <Typography variant="h6" mb={1}>
              {status}
            </Typography>

            <KanbanColumn
              status={status}
              tasks={groupedTasks[status]}
            />
          </Grid>
        ))}
      </Grid>
    </DragDropContext>
  );
};

export default KanbanBoard;
