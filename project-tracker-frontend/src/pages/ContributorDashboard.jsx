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
import api from "../services/api";
import ContributorActivityFeed from "../components/contributor/ContributorActivityFeed";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const ContributorDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const today = new Date();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/v1/task/my-tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= STATS =================

  const pending = tasks.filter((t) => t.status === "TODO").length;
  const inProgress = tasks.filter((t) => t.status === "IN PROGRESS").length;
  const completed = tasks.filter((t) => t.status === "DONE").length;

  const overdue = tasks.filter((t) => {
    return (
      t.due_date &&
      new Date(t.due_date) < today &&
      t.status !== "DONE"
    );
  }).length;

  // ================= PRIORITY DATA =================

  const high = tasks.filter((t) => t.priority === "HIGH").length;
  const medium = tasks.filter((t) => t.priority === "MEDIUM").length;
  const low = tasks.filter((t) => t.priority === "LOW").length;

  const priorityData = [
    { name: "High", value: high},
    { name: "Medium", value: medium},
    { name: "Low", value: low},
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

  // ================= TODAY TASKS =================

  const todayTasks = tasks.filter((t) => {
    console.log(priorityData)

    return (
      t.due_date &&
      new Date(t.due_date).toDateString() ===
        today.toDateString()
    );
  });

  // ================= SEARCH =================

  const filteredTasks = tasks.filter((task) =>
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
  <Box
    sx={{
      px: { xs: 3, md: 6 },
      py: 4,
      minHeight: "100vh",
      bgcolor: "background.default",
      color: "text.primary",
    }}
  >
    {/* HEADER */}
    <Box mb={4}>
      <Typography variant="h5" fontWeight={600} color="text.primary">
        Welcome back 👋
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Here's a quick overview of your assigned tasks.
      </Typography>
    </Box>

    <Grid container spacing={3}>
      {/* ================= LEFT MAIN ================= */}
      <Grid item xs={12} md={6}>
        
        {/* STATS */}
        <Grid container spacing={3} mb={4}>
          {[
            { label: "Pending", value: pending },
            { label: "In Progress", value: inProgress },
            { label: "Completed", value: completed },
            { label: "Overdue", value: overdue, color: "error.main" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{ color: item.color || "text.primary", mt: 1 }}
                  >
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* SEARCH */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Paper>

        {/* TASK TABLE */}
        <Paper
          sx={{
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {["Task", "Priority", "Due Date", "Status"].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      color: "text.secondary",
                      fontSize: 13,
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.task_id}>
                  <TableCell sx={{ color: "text.primary" }}>
                    {task.task_title}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {task.priority}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      size="small"
                      color={getStatusColor(task.status)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      {/* ================= PRIORITY CHART ================= */}
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 2,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            height: 350,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="subtitle2" color="text.primary" mb={2}>
            Task Priority
          </Typography>

          {priorityData.reduce((acc, item) => acc + item.value, 0) === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              No priority data
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 250,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <PieChart width={260} height={260}>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* ================= ACTIVITY ================= */}
      <Grid item xs={12} md={2}>
        <Box sx={{ position: "sticky", top: 24 }}>
          <ContributorActivityFeed />
        </Box>
      </Grid>
    </Grid>
  </Box>
);

};

export default ContributorDashboard;
