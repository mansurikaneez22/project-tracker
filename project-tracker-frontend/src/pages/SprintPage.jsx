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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import AddToSprintDialog from "../components/AddToSprintDialog";
import CreateSprintDialog from "../components/CreateSprintDialog";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const SprintPage = () => {
  const { deptId, teamId, projectId } = useParams();

  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [unfinishedTasks, setUnfinishedTasks] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const user = JSON.parse(localStorage.getItem("user"));
  const isPM = user?.job_profile === "PROJECT MANAGER";

  /* ================= FETCH ================= */

  const fetchSprints = useCallback(async () => {
    try {
      const res = await api.get(`/api/v1/project/${projectId}/sprints/`);
      setSprints(res.data || []);
    } catch {
      setSprints([]);
    }
  }, [projectId]);

  const fetchTasks = useCallback(async () => {
    try {
      let res;

      if (isPM) {
        res = await api.get(
          `/api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}/task`
        );
      } else {
        res = await api.get(`/api/v1/project/${projectId}/task`);
      }

      setTasks(res.data.tasks ? res.data.tasks : res.data);
    } catch {
      setTasks([]);
    }
  }, [deptId, teamId, projectId, isPM]);

  useEffect(() => {
    if (projectId) {
      fetchSprints();
      fetchTasks();
    }
  }, [projectId, fetchSprints, fetchTasks]);

  /* ================= BACKLOG ================= */

  const backlogTasks = tasks.filter(
    (task) => task.sprint_id === null || task.sprint_id === undefined
  );

  /* ================= START ================= */

  const handleStart = async (sprintId) => {
    await api.put(`/api/v1/project/${projectId}/sprints/${sprintId}/start`);
    fetchSprints();
  };

  /* ================= COMPLETE WITH DIALOG ================= */

  const handleCompleteClick = (sprint) => {
    const sprintTasks = tasks.filter(
      (t) => t.sprint_id === sprint.sprint_id
    );

    const unfinished = sprintTasks.filter(
      (task) => task.status !== "DONE"
    );

    if (unfinished.length > 0) {
      setSelectedSprint(sprint);
      setUnfinishedTasks(unfinished);
      setCompleteDialogOpen(true);
    } else {
      completeSprint(sprint.sprint_id, false);
    }
  };

  const completeSprint = async (sprintId, moveToBacklog) => {
    try {
      await api.put(
        `/api/v1/project/${projectId}/sprints/${sprintId}/complete`,
        { move_to_backlog: moveToBacklog }
      );

      setSnackbarMsg("Sprint completed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setCompleteDialogOpen(false);
      fetchSprints();
      fetchTasks();
    } catch {
      setSnackbarMsg("Failed to complete sprint.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  /* ================= DRAG ================= */

  const onDragEnd = async (result) => {
    if (!isPM) return;

    const { destination, draggableId } = result;
    if (!destination) return;

    const taskId = parseInt(draggableId);
    const destId =
      destination.droppableId === "backlog"
        ? null
        : parseInt(destination.droppableId);

    await api.put(
      `/api/v1/task/${taskId}/assign-sprint`,
      null,
      { params: { sprint_id: destId } }
    );

    fetchTasks();
  };

  /* ================= DATE LOGIC ================= */

  const getSprintMeta = (sprint) => {
    const today = new Date();
    const start = new Date(sprint.start_date);
    const end = new Date(sprint.end_date);

    const daysLeft = Math.ceil(
      (end - today) / (1000 * 60 * 60 * 24)
    );

    const isOverdue =
      sprint.status === "ACTIVE" && today > end;

    return { start, end, daysLeft, isOverdue };
  };

  /* ================= UI ================= */

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h5" fontWeight={600}>
          Sprint Planning
        </Typography>

        {isPM && (
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            + Create Sprint
          </Button>
        )}
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Stack spacing={4}>
          {sprints.map((sprint) => {
            const sprintTasks = tasks.filter(
              (t) => t.sprint_id === sprint.sprint_id
            );

            const { start, end, daysLeft, isOverdue } =
              getSprintMeta(sprint);

            return (
              <Card key={sprint.sprint_id}>
                <CardContent>

                  {/* HEADER */}
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography fontWeight={600} variant="h6">
                        {sprint.sprint_name}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "#94a3b8", mt: 0.5 }}
                      >
                        {start.toLocaleDateString()} -{" "}
                        {end.toLocaleDateString()}
                      </Typography>

                      {sprint.status === "ACTIVE" && !isOverdue && (
                        <Typography
                          variant="body2"
                          sx={{ color: "#22c55e", mt: 0.5 }}
                        >
                          {daysLeft >= 0
                            ? `${daysLeft} days left`
                            : null}
                        </Typography>
                      )}

                      {isOverdue && (
                        <Typography
                          variant="body2"
                          sx={{ color: "#ef4444", mt: 0.5 }}
                        >
                          ⚠ Overdue by {Math.abs(daysLeft)} days
                        </Typography>
                      )}
                    </Box>

                    <Chip label={sprint.status} />
                  </Box>

                  {/* ACTIONS */}
                  {sprint.status === "PLANNED" && isPM && (
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

                  {sprint.status === "ACTIVE" && isPM && (
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() =>
                        handleCompleteClick(sprint)
                      }
                    >
                      Complete Sprint
                    </Button>
                  )}

                  {/* TASK TABLE */}
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
                              <TableCell>Task</TableCell>
                              <TableCell>Assignee</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sprintTasks.map((task, index) => (
                              <Draggable
                                key={task.task_id}
                                draggableId={`${task.task_id}`}
                                index={index}
                                isDragDisabled={!isPM}
                              >
                                {(provided) => (
                                  <TableRow
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TableCell>
                                      {task.task_title}
                                    </TableCell>
                                    <TableCell>
                                      {task.assignee_name ||
                                        "Unassigned"}
                                    </TableCell>
                                    <TableCell>
                                      {task.status}
                                    </TableCell>
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

          {/* BACKLOG */}
          <Divider sx={{ my: 5 }} />
          <Typography variant="h6" fontWeight={600} mb={2}>
            Backlog
          </Typography>

          <Droppable droppableId="backlog">
            {(provided) => (
              <Card ref={provided.innerRef} {...provided.droppableProps}>
                <CardContent>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Task</TableCell>
                          <TableCell>Assignee</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {backlogTasks.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3}>
                              No backlog tasks.
                            </TableCell>
                          </TableRow>
                        )}

                        {backlogTasks.map((task, index) => (
                          <Draggable
                            key={task.task_id}
                            draggableId={`${task.task_id}`}
                            index={index}
                          >
                            {(provided) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TableCell>
                                  {task.task_title}
                                </TableCell>
                                <TableCell>
                                  {task.assignee_name ||
                                    "Unassigned"}
                                </TableCell>
                                <TableCell>
                                  Add to Sprint
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

      {/* COMPLETE DIALOG */}
      <Dialog
        open={completeDialogOpen}
        onClose={() => setCompleteDialogOpen(false)}
      >
        <DialogTitle>Unfinished Tasks</DialogTitle>
        <DialogContent>
          <Typography>
            {unfinishedTasks.length} tasks are not completed.
            Move them to backlog before completing sprint?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              completeSprint(
                selectedSprint.sprint_id,
                true
              )
            }
          >
            Move & Complete
          </Button>
        </DialogActions>
      </Dialog>

      {/* CREATE DIALOG */}
      <CreateSprintDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        projectId={projectId}
        onCreated={fetchSprints}
      />

      {/* SNACKBAR */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SprintPage;