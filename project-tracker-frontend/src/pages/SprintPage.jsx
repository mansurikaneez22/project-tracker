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
  DialogActions,
  Tabs,
  Tab,
  Select,
  MenuItem
} from "@mui/material";

import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import CreateSprintDialog from "../components/CreateSprintDialog";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const SprintPage = () => {
  const { deptId, teamId, projectId } = useParams();

  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [tab, setTab] = useState("ACTIVE");

  const [createOpen, setCreateOpen] = useState(false);

  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [unfinishedTasks, setUnfinishedTasks] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const user = JSON.parse(localStorage.getItem("user"));
  const isPM = user?.job_profile === "PROJECT MANAGER";

  /* FETCH  */

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

  /* FILTER*/

  const filteredSprints =
    tab === "BACKLOG"
      ? []
      : sprints.filter((s) => s.status === tab);

  const backlogTasks = tasks.filter(
    (task) => task.sprint_id === null || task.sprint_id === undefined
  );

  /* START */

  const handleStart = async (sprintId) => {
    await api.put(`/api/v1/project/${projectId}/sprints/${sprintId}/start`);
    fetchSprints();
  };

  /*COMPLETE  */

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

  /*  DRAG*/

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

  /*DATE LOGIC */

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

  /*  UI */

  return (
    <Box>

      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Sprint Planning
        </Typography>

        {isPM && (
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            + Create Sprint
          </Button>
        )}
      </Box>

      {/* TABS */}
      <Tabs
        value={tab}
        onChange={(e, val) => setTab(val)}
        sx={{ mb: 3 }}
      >
        <Tab label="Active Sprint" value="ACTIVE" />
        <Tab label="Planned" value="PLANNED" />
        <Tab label="Completed" value="COMPLETED" />
        <Tab label="Backlog" value="BACKLOG" />
      </Tabs>

      <DragDropContext onDragEnd={onDragEnd}>

        <Stack spacing={4}>

          {/* SPRINTS */}
          {filteredSprints.map((sprint) => {

            const sprintTasks = tasks.filter(
              (t) => t.sprint_id === sprint.sprint_id
            );

            const { start, end, daysLeft, isOverdue } =
              getSprintMeta(sprint);

            return (
              <Card key={sprint.sprint_id}>
                <CardContent>

                  <Box display="flex" justifyContent="space-between">
                    <Box>

                      <Typography fontWeight={600} variant="h6">
                        {sprint.sprint_name}
                      </Typography>

                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        {start.toLocaleDateString()} - {end.toLocaleDateString()}
                      </Typography>

                      {sprint.status === "ACTIVE" && !isOverdue && (
                        <Typography variant="body2" sx={{ color: "#22c55e" }}>
                          {daysLeft >= 0 ? `${daysLeft} days left` : null}
                        </Typography>
                      )}

                      {isOverdue && (
                        <Typography variant="body2" sx={{ color: "#ef4444" }}>
                          ⚠ Overdue by {Math.abs(daysLeft)} days
                        </Typography>
                      )}

                    </Box>

                    <Chip label={sprint.status} />

                  </Box>

                  {sprint.status === "PLANNED" && isPM && (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => handleStart(sprint.sprint_id)}
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
                      onClick={() => handleCompleteClick(sprint)}
                    >
                      Complete Sprint
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
                                    <TableCell>{task.task_title}</TableCell>
                                    <TableCell>
                                      {task.assignee_name || "Unassigned"}
                                    </TableCell>
                                    <TableCell>{task.status}</TableCell>
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

          {/* BACKLOG TAB */}

          {tab === "BACKLOG" && (

            <Card>

              <CardContent>

                <Typography variant="h6" fontWeight={600} mb={2}>
                  Backlog
                </Typography>

                <Droppable droppableId="backlog">

                  {(provided) => (

                    <TableContainer
                      component={Paper}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >

                      <Table size="small">

                        <TableHead>
                          <TableRow>
                            <TableCell>Task</TableCell>
                            <TableCell>Assignee</TableCell>
                            <TableCell>Add to Sprint</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>

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

  <TableCell>{task.task_title}</TableCell>

  <TableCell>
    {task.assignee_name || "Unassigned"}
  </TableCell>

  <TableCell>

    <Select
      size="small"
      displayEmpty
      value=""
      onChange={async (e) => {

        const sprintId = e.target.value;

        await api.put(
          `/api/v1/task/${task.task_id}/assign-sprint`,
          null,
          { params: { sprint_id: sprintId } }
        );

        fetchTasks();
      }}
      sx={{ minWidth: 150 }}
    >

      <MenuItem disabled value="">
        Select Sprint
      </MenuItem>

      {sprints
        .filter(
          (s) =>
            s.status === "ACTIVE" ||
            s.status === "PLANNED"
        )
        .map((s) => (
          <MenuItem
            key={s.sprint_id}
            value={s.sprint_id}
          >
            {s.sprint_name} ({s.status})
          </MenuItem>
        ))}

    </Select>

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

          )}

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
              completeSprint(selectedSprint.sprint_id, true)
            }
          >
            Move & Complete
          </Button>

        </DialogActions>

      </Dialog>

      {/* CREATE SPRINT */}

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

        <Alert severity={snackbarSeverity} variant="filled">
          {snackbarMsg}
        </Alert>

      </Snackbar>

    </Box>
  );
};

export default SprintPage;