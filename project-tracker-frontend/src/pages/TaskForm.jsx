// src/components/TaskForm.jsx
import React, { useState } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import api from "../services/api";

const TaskForm = ({ onTaskCreated, projectId = 1, boardId = null }) => {
  const [form, setForm] = useState({
    task_title: "",
    task_description: "",
    assignee_id: "",
    priority: "Low",
    due_date: "",
    status: "TODO",
    project_id: projectId,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //  Create Task
      const res = await api.post("/api/v1/task/", form);
      const taskId = res.data.task_id;

      // Assign task to board if boardId is provided
      if (boardId) {
        await api.post(`/api/v1/board_task_mapping/`, null, {
          params: { board_id: boardId, task_id: taskId },
        });
      }

      onTaskCreated();
      setForm({
        task_title: "",
        task_description: "",
        assignee_id: "",
        priority: "Low",
        due_date: "",
        status: "TODO",
        project_id: projectId,
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ my: 2 }}>
      <TextField
        fullWidth
        label="Task Title"
        name="task_title"
        value={form.task_title}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Task Description"
        name="task_description"
        value={form.task_description}
        onChange={handleChange}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Assignee ID"
        name="assignee_id"
        value={form.assignee_id}
        onChange={handleChange}
        type="number"
        sx={{ mb: 2 }}
      />
      <TextField
        select
        fullWidth
        label="Priority"
        name="priority"
        value={form.priority}
        onChange={handleChange}
        sx={{ mb: 2 }}
      >
        <MenuItem value="Low">Low</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="High">High</MenuItem>
      </TextField>
      <TextField
        fullWidth
        label="Due Date"
        type="date"
        name="due_date"
        value={form.due_date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" type="submit">
        Create Task
      </Button>
    </Box>
  );
};

export default TaskForm;
