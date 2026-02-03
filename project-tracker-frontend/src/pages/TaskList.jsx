import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import TaskCard from "../components/Taskcard";
import api from "../services/api";

const TaskList = () => {
  const { departmentId, teamId, projectId } = useParams();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    if (!departmentId || !teamId || !projectId) {
      console.warn("Missing IDs", { departmentId, teamId, projectId });
      return;
    }

    try {
      const res = await api.get(
        `/api/v1/project/department/${departmentId}/team/${teamId}/project/${projectId}/task/`
      );
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error.response || error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [departmentId, teamId, projectId]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        All Tasks
      </Typography>

      {tasks.length === 0 ? (
        <Typography>No tasks for this project</Typography>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.task_id} task={task} />
        ))
      )}
    </Box>
  );
};

export default TaskList;
