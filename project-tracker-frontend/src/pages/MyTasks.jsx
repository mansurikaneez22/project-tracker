import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import api from "../services/api";
import MyTasksCalendar from "../components/MyTasksCalendar";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/v1/task/my-tasks");

      // Map backend fields to calendar format
      const formattedTasks = res.data.map((task) => ({
        id: task.task_id,
        title: task.task_title,
        description: task.task_description,
        due_date: task.due_date,
        status: task.status,
        priority: task.priority,
      }));

      setTasks(formattedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

 //  Apply filters
const filteredTasks = useMemo(() => {
  const today = new Date();

  return tasks.filter((task) => {
    // Status filter (existing)
    const matchesStatus =
      statusFilter === "ALL" || task.status === statusFilter;

    // Search filter (existing)
    const matchesSearch = task.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    // NEW: hide completed past tasks
    let isValidTask = true;

    if (task.due_date) {
      const due = new Date(task.due_date);

      isValidTask =
        due >= today || task.status !== "DONE";
    }

    return matchesStatus && matchesSearch && isValidTask;
  });
}, [tasks, statusFilter, search]);

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Tasks
      </Typography>

      {/* Filters */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
        <TextField
          label="Search Task"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          select
          label="Status"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="TODO">TODO</MenuItem>
          <MenuItem value="IN PROGRESS">IN PROGRESS</MenuItem>
          <MenuItem value="DONE">DONE</MenuItem>
          <MenuItem value="BLOCKED">BLOCKED</MenuItem>
        </TextField>
      </Stack>

      {/* Calendar View */}
      <MyTasksCalendar tasks={filteredTasks} />
    </Box>
  );
};

export default MyTasks;
