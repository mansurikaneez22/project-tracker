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

const PMTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/v1/pm/tasks");

      // Map backend response to calendar format
      const formattedTasks = res.data.map((task) => ({
        id: task.task_id,
        title: task.title,
        description: `${task.project} | ${task.assignee}`,
        due_date: task.due_date,
        status: task.status,
        priority: task.priority,
      }));

      setTasks(formattedTasks);
    } catch (err) {
      console.error("Error fetching PM tasks:", err);
    }
  };

  // Apply filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter;

      const matchesSearch = task.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, search]);

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        PM Tasks
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
          <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
          <MenuItem value="DONE">DONE</MenuItem>
          <MenuItem value="BLOCKED">BLOCKED</MenuItem>
        </TextField>
      </Stack>

      {/* Calendar */}
      <MyTasksCalendar tasks={filteredTasks} />
    </Box>
  );
};

export default PMTasks;