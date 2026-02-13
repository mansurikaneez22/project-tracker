import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar
} from "@mui/material";

import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import AddToSprintDialog from "../components/AddToSprintDialog";
import CreateSprintDialog from "../components/CreateSprintDialog";

const SprintPage = () => {
  const { deptId, teamId, projectId } = useParams();

  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  // ================= FETCH =================

  const fetchSprints = useCallback(async () => {
    try {
      const res = await api.get(
        `/api/v1/project/${projectId}/sprints/`
      );
      setSprints(res.data || []);
    } catch (err) {
      console.error(err);
      setSprints([]);
    }
  }, [projectId]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get(
        `/api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}/task`
      );
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  }, [deptId, teamId, projectId]);

  useEffect(() => {
    if (projectId && deptId && teamId) {
      fetchSprints();
      fetchTasks();
    }
  }, [projectId, deptId, teamId, fetchSprints, fetchTasks]);

  // ================= START SPRINT =================

  const handleStart = async (sprintId) => {
    try {
      await api.put(
        `/api/v1/project/${projectId}/sprints/${sprintId}/start`
      );

      setSnackbarMsg("Sprint started successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      await fetchSprints();
      await fetchTasks();
    } catch (err) {
  const message =
    err.response?.data?.detail ||
    "Error starting sprint";

  setSnackbarMsg(message);
  setSnackbarSeverity("error");
  setSnackbarOpen(true);
  }
};

  // ================= CREATE SPRINT =================

  const handleSprintCreated = async () => {
    setCreateOpen(false);
    await fetchSprints();
  };

  // ================= ASSIGN =================

  const handleAddToSprint = async (taskId, sprintId) => {
    try {
      await api.put(
        `/api/v1/task/${taskId}/assign-sprint`,
        null,
        { params: { sprint_id: sprintId } }
      );

      setDialogOpen(false);
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const backlogTasks = tasks.filter((task) => !task.sprint_id);

  return (
    <Box>

      {/* ================= HEADER ================= */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h5" fontWeight={600}>
          Sprint Planning
        </Typography>

        <Button
          variant="contained"
          onClick={() => setCreateOpen(true)}
        >
          + Create Sprint
        </Button>
      </Box>

      {/* ================= SPRINTS ================= */}
      <Stack spacing={4}>
        {sprints.map((sprint) => {
          const sprintTasks = tasks.filter(
            (task) => task.sprint_id === sprint.sprint_id
          );

          return (
            <Card key={sprint.sprint_id}>
              <CardContent>

                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>
                    {sprint.sprint_name}
                  </Typography>

                  <Chip
                    label={sprint.status}
                    color={
                      sprint.status === "ACTIVE"
                        ? "success"
                        : sprint.status === "COMPLETED"
                        ? "default"
                        : "primary"
                    }
                  />
                </Box>

                {sprint.status === "ACTIVE" && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {`Start: ${sprint.start_date || "-"}  |  End: ${
                      sprint.end_date || "-"
                    }`}
                  </Typography>
                )}

                {sprint.status === "PLANNED" && (
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() =>
                      handleStart(sprint.sprint_id)
                    }
                  >
                    Start
                  </Button>
                )}

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Task</strong></TableCell>
                        <TableCell><strong>Assignee</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sprintTasks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3}>
                            No tasks in this sprint.
                          </TableCell>
                        </TableRow>
                      ) : (
                        sprintTasks.map((task) => (
                          <TableRow key={task.task_id}>
                            <TableCell>{task.task_title}</TableCell>
                            <TableCell>
                              {task.assignee_name || "Unassigned"}
                            </TableCell>
                            <TableCell>
                              {task.status || "TODO"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* ================= BACKLOG ================= */}
      <Divider sx={{ my: 5 }} />

      <Typography variant="h6" fontWeight={600} mb={2}>
        Backlog
      </Typography>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Task</strong></TableCell>
                  <TableCell><strong>Assignee</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {backlogTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      No backlog tasks.
                    </TableCell>
                  </TableRow>
                ) : (
                  backlogTasks.map((task) => (
                    <TableRow key={task.task_id}>
                      <TableCell>{task.task_title}</TableCell>
                      <TableCell>
                        {task.assignee_name || "Unassigned"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedTask(task);
                            setDialogOpen(true);
                          }}
                        >
                          Add to Sprint
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* ================= DIALOGS ================= */}

      <AddToSprintDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedTask(null);
        }}
        sprints={sprints}
        task={selectedTask}
        onConfirm={handleAddToSprint}
      />

      <CreateSprintDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        projectId={projectId}
        onCreated={handleSprintCreated}
      />
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={4000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    onClose={() => setSnackbarOpen(false)}
    severity={snackbarSeverity}
    variant="filled"
    sx={{ width: "100%" }}
  >
    {snackbarMsg}
  </Alert>
</Snackbar>

    </Box>
  );
};

export default SprintPage;
