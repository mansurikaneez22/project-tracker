import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import api from "../services/api";

const CreateTaskModal = ({
  open,
  onClose,
  projectId,
  boardId,
  refreshTasks
}) => {
  const initialFormState = {
    task_title: "",
    task_description: "",
    assignee_id: "",
    priority: "Medium",
    estimation_points: 1,
    start_date: "",
    due_date: "",
    status: "TODO" // ✅ IMPORTANT
  };

  const [form, setForm] = useState(initialFormState);
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    if (open) {
      setForm(initialFormState);
      fetchProjectMembers();
    }
  }, [open]);

  const fetchProjectMembers = async () => {
    try {
      const res = await api.get(
        `/api/v1/project-members/project/${projectId}`
      );
      setAssignees(res.data || []);
    } catch (err) {
      console.error("Failed to fetch project members:", err);
      setAssignees([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.task_title.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      // ✅ TASK CREATE PAYLOAD
      const payload = {
        task_title: form.task_title.trim(),
        task_description: form.task_description?.trim() || null,
        project_id: Number(projectId),
        assignee_id:
          form.assignee_id === "" ? null : Number(form.assignee_id),
        priority: form.priority,
        estimation_points: Number(form.estimation_points || 1),
        start_date: form.start_date || null,
        due_date: form.due_date || null,
        status: form.status // ✅ VERY IMPORTANT
      };

      const res = await api.post("/api/v1/task/", payload);
      const taskId = res.data.task_id;

      // ✅ MAP TASK TO SPRINT (BOARD)
      await api.post("/api/v1/board_task_mapping", {
        board_id: Number(boardId),
        task_id: taskId
      });

      refreshTasks();
      onClose();
      setForm(initialFormState);
    } catch (err) {
      console.error(
        "BACKEND ERROR 👉",
        err.response?.data || err.message
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Task</DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <TextField
          fullWidth
          label="Title"
          name="task_title"
          value={form.task_title}
          onChange={handleChange}
          margin="dense"
        />

        <TextField
          fullWidth
          label="Description"
          name="task_description"
          value={form.task_description}
          onChange={handleChange}
          margin="dense"
          multiline
          rows={3}
        />

        {/* PRIORITY */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            label="Priority"
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>

        {/* STATUS ✅ */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={form.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="TODO">TODO</MenuItem>
            <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
            <MenuItem value="DONE">DONE</MenuItem>
          </Select>
        </FormControl>

        {/* ASSIGNEE */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Assign To</InputLabel>
          <Select
            name="assignee_id"
            value={form.assignee_id}
            onChange={handleChange}
            label="Assign To"
          >
            <MenuItem value="">None</MenuItem>
            {assignees.map((user) => (
              <MenuItem key={user.user_id} value={user.user_id}>
                {user.user_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Estimation Points"
          name="estimation_points"
          type="number"
          value={form.estimation_points}
          onChange={handleChange}
          margin="dense"
          inputProps={{ min: 1 }}
        />

        <TextField
          fullWidth
          type="date"
          label="Start Date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          type="date"
          label="Due Date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskModal;
