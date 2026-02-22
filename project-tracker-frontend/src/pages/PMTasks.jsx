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
      px: { xs: 2, md: 6 },
      py: 4,
      width: "100%",
    }}
  >
    {/* Header */}
    <Box mb={4}>
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ letterSpacing: 0.5 }}
      >
        PM Tasks
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage and track all assigned project tasks
      </Typography>
    </Box>

    {/* Filters Card */}
    <Box
      sx={{
        p: 3,
        mb: 4,
        borderRadius: "16px",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
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
      sx={{
        borderRadius: "20px",
        p: { xs: 1, md: 3 },
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <MyTasksCalendar tasks={filteredTasks} />
    </Box>
  </Box>
);

};

export default PMTasks;