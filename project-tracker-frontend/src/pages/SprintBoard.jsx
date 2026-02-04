import { Box, Typography, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

const SprintBoard = () => {
  const { sprintId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!sprintId) return;

    api 
      .get(`/api/v1/board_task_mapping/board/${sprintId}/task`)
      .then((res) => {
        setTasks(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setTasks([]));
  }, [sprintId]);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Sprint Board (Board ID: {sprintId})
      </Typography>

      <Box display="flex" gap={2}>
        {STATUSES.map((status) => {
          const columnTasks = tasks.filter(
            (task) => task.status === status
          );

          return (
            <Paper
              key={status}
              sx={{
                flex: 1,
                minHeight: "60vh",
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f4f5f7"
              }}
            >
              <Typography fontWeight={700} mb={2}>
                {status.replace("_", " ")}
              </Typography>

              {columnTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No tasks
                </Typography>
              ) : (
                columnTasks.map((task) => (
                  <Paper
                    key={task.task_id}
                    sx={{ p: 1.5, mb: 1, borderRadius: 1 }}
                  >
                    <Typography fontWeight={500}>
                      {task.task_title}
                    </Typography>
                    <Typography variant="caption">
                      {task.priority}
                    </Typography>
                  </Paper>
                ))
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default SprintBoard;
