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
  <Box
    sx={{
      px: { xs: 2, md: 4 },
      py: 4,
      width: "100%",
      maxWidth: "1800px",
      mx: "auto",
    }}
  >
    {/* Header */}
    <Box mb={4}>
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ letterSpacing: 0.5 }}
      >
        My Tasks
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage and track all assigned project tasks
      </Typography>
    </Box>

    {/* Filters Card */}
    {/* Filters Card */}
<Box
  sx={(theme) => ({
    p: 3,
    mb: 4,
    borderRadius: "18px",
    background:
      theme.palette.mode === "light"
        ? "#ffffff"
        : "rgba(255,255,255,0.04)",
    boxShadow:
      theme.palette.mode === "light"
        ? "0 8px 30px rgba(0,0,0,0.06)"
        : "none",
    border:
      theme.palette.mode === "light"
        ? "1px solid #eaeaea"
        : "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
  })}
>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems={{ sm: "center" }}
      >
        <TextField
          label="Search task..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            maxWidth: 350,
          }}
        />

        <TextField
          select
          label="Status"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="TODO">TODO</MenuItem>
          <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
          <MenuItem value="DONE">DONE</MenuItem>
          <MenuItem value="BLOCKED">BLOCKED</MenuItem>
        </TextField>
      </Stack>
    </Box>
   {/* Calendar Section */}
<Box
  sx={(theme) => ({
    borderRadius: "22px",
    p: { xs: 2, md: 4 },
    background:
      theme.palette.mode === "light"
        ? "#ffffff"
        : "rgba(255,255,255,0.02)",
    border:
      theme.palette.mode === "light"
        ? "1px solid #eaeaea"
        : "1px solid rgba(255,255,255,0.05)",
    boxShadow:
      theme.palette.mode === "light"
        ? "0 10px 40px rgba(0,0,0,0.06)"
        : "none",
  })}
>
      <MyTasksCalendar tasks={filteredTasks} />
    </Box>
  </Box>
);

};

export default PMTasks;