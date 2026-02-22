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
  Snackbar,
  Alert
} from "@mui/material";

import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import AddToSprintDialog from "../components/AddToSprintDialog";
import CreateSprintDialog from "../components/CreateSprintDialog";

// 🔹 Drag & Drop (for React 19)
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  const fetchSprints = useCallback(async () => {
    try {
      const res = await api.get(`/api/v1/project/${projectId}/sprints/`);
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

  const backlogTasks = tasks.filter((task) => !task.sprint_id);

  // ================= START SPRINT =================
  const handleStart = async (sprintId) => {
    try {
      await api.put(`/api/v1/project/${projectId}/sprints/${sprintId}/start`);
      setSnackbarMsg("Sprint started successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      await fetchSprints();
      await fetchTasks();
    } catch (err) {
      const message = err.response?.data?.detail || "Error starting sprint";
      setSnackbarMsg(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  // ================= COMPLETE SPRINT =================
const handleComplete = async (sprintId) => {
  try {
    await api.put(
      `/api/v1/project/${projectId}/sprints/${sprintId}/complete`
    );

    setSnackbarMsg("Sprint completed successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    await fetchSprints();
    await fetchTasks();
  } catch (err) {
    const message =
      err.response?.data?.detail || "Error completing sprint";
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

  // ================= DRAG & DROP HANDLER =================
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const taskId = parseInt(draggableId);

    const sourceId = source.droppableId === "backlog" ? null : parseInt(source.droppableId);
    const destId = destination.droppableId === "backlog" ? null : parseInt(destination.droppableId);

    if (sourceId === destId) return; // no change

    try {
      await api.put(
        `/api/v1/task/${taskId}/assign-sprint`,
        null,
        { params: { sprint_id: destId } }
      );
      await fetchTasks();
    } catch (err) {
      console.error(err);
      setSnackbarMsg("Error moving task");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={600}>Sprint Planning</Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>+ Create Sprint</Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Stack spacing={4}>
          {sprints.map((sprint) => {
  const sprintTasks = tasks.filter(
    (t) => t.sprint_id === sprint.sprint_id
  );

  const isExpired =
    sprint.status === "ACTIVE" &&
    sprint.end_date &&
    new Date() > new Date(sprint.end_date);

  return (
              <Card key={sprint.sprint_id}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={600}>{sprint.sprint_name}</Typography>
                    <Chip
  label={isExpired ? "OVERDUE" : sprint.status}
  color={
    sprint.status === "ACTIVE"
      ? isExpired
        ? "warning"
        : "success"
      : sprint.status === "COMPLETED"
      ? "default"
      : "primary"
  }
/>
                  </Box>

                  {sprint.status === "ACTIVE" && (
  <>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mt: 1 }}
    >
      {`Start: ${sprint.start_date || "-"}  |  End: ${
        sprint.end_date || "-"
      }`}
    </Typography>
    
    {isExpired && (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Sprint end date passed. Please complete sprint.
      </Alert>
    )}
    <Button
      size="small"
      color="error"
      variant="contained"
      sx={{ mt: 2 }}
      onClick={() => handleComplete(sprint.sprint_id)}
    >
      Complete Sprint
    </Button>
  </>
)}

                  {sprint.status === "PLANNED" && (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => handleStart(sprint.sprint_id)}
                    >
                      Start
                    </Button>
                  )}

                  <Droppable droppableId={`${sprint.sprint_id}`}>
                    {(provided) => (
                      <TableContainer
                        component={Paper}
                        sx={{ mt: 2 }}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Task</strong></TableCell>
                              <TableCell><strong>Assignee</strong></TableCell>
                              <TableCell><strong>Status</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sprintTasks.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={3}>No tasks in this sprint.</TableCell>
                              </TableRow>
                            )}
                            {sprintTasks.map((task, index) => (
                              <Draggable key={task.task_id} draggableId={`${task.task_id}`} index={index}>
                                {(provided) => (
                                  <TableRow
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TableCell>{task.task_title}</TableCell>
                                    <TableCell>{task.assignee_name || "Unassigned"}</TableCell>
                                    <TableCell>{task.status || "TODO"}</TableCell>
                                  </TableRow>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            );
          })}

          {/* ================= BACKLOG ================= */}
          <Divider sx={{ my: 5 }} />
          <Typography variant="h6" fontWeight={600} mb={2}>Backlog</Typography>

          <Droppable droppableId="backlog">
            {(provided) => (
              <Card ref={provided.innerRef} {...provided.droppableProps}>
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
                        {backlogTasks.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3}>No backlog tasks.</TableCell>
                          </TableRow>
                        )}
                        {backlogTasks.map((task, index) => (
                          <Draggable key={task.task_id} draggableId={`${task.task_id}`} index={index}>
                            {(provided) => (
                              <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <TableCell>{task.task_title}</TableCell>
                                <TableCell>{task.assignee_name || "Unassigned"}</TableCell>
                                <TableCell>
                                  <Button
                                    size="small"
                                    onClick={() => { setSelectedTask(task); setDialogOpen(true); }}
                                  >
                                    Add to Sprint
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </Droppable>
        </Stack>
      </DragDropContext>

      {/* ================= DIALOGS ================= */}
      <AddToSprintDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setSelectedTask(null); }}
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
