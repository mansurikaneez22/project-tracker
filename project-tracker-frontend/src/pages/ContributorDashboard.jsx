import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const ContributorDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/v1/task/my-tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Stats calculation
  const pending = tasks.filter(t => t.status === "TODO").length;
  const inProgress = tasks.filter(t => t.status === "IN PROGRESS").length;
  const completed = tasks.filter(t => t.status === "DONE").length;

  const filteredTasks = tasks.filter(task =>
    task.task_title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "TODO":
        return "warning";
      case "IN PROGRESS":
        return "info";
      case "DONE":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box p={4} bgcolor="#f4f6f8" minHeight="100vh">
      
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Welcome Back 👋
      </Typography>
      <Typography variant="subtitle1" mb={4} color="text.secondary">
        Here’s an overview of your assigned tasks.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h4" fontWeight="bold">
                {pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">In Progress</Typography>
              <Typography variant="h4" fontWeight="bold">
                {inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Completed</Typography>
              <Typography variant="h4" fontWeight="bold">
                {completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search Task"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>

      {/* Task Table */}
      <Paper sx={{ p: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Task</strong></TableCell>
              <TableCell><strong>Priority</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow key={task.task_id}>
                  <TableCell>{task.task_title}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.due_date}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={getStatusColor(task.status)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No tasks assigned yet 🚀
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

    </Box>
  );
};

export default ContributorDashboard;
