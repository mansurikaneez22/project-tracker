import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import CreateTaskModal from "../components/CreateTaskModal";

const TaskList = () => {
  // ✅ FIRST get params
  const { deptId, teamId, projectId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [openCreateTask, setOpenCreateTask] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get(
        `/api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}/task`
      );
      console.log("TASK API RESPONSE:", res.data);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Task fetch error:", err);
      setTasks([]);
    }
  };

  const fetchBoards = async () => {
    try {
      const res = await api.get(`/api/v1/board/project/${projectId}`);
      if (res.data?.length > 0) {
        setActiveBoardId(res.data[0].board_id);
      }
    } catch (err) {
      console.error("Board fetch error:", err);
    }
  };

  useEffect(() => {
    if (deptId && teamId && projectId) {
      fetchTasks();
      fetchBoards();
    }
  }, [deptId, teamId, projectId]);

  const goToTaskDetail = (taskId) => {
    navigate(
      `/project/${projectId}/task/${taskId}`
    );
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">All Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateTask(true)}
        >
          Create Task
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Task Title</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>Due</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Sprint</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.task_id} hover>
                <TableCell
                  sx={{ cursor: "pointer", color: "primary.main" }}
                  onClick={() => goToTaskDetail(task.task_id)}
                >
                  {task.task_id}
                </TableCell>

                <TableCell
                  sx={{ cursor: "pointer", fontWeight: 500 }}
                  onClick={() => goToTaskDetail(task.task_id)}
                >
                  {task.task_title}
                </TableCell>

                <TableCell>{task.assignee_name || "—"}</TableCell>
                <TableCell>{task.start_date || "—"}</TableCell>
                <TableCell>{task.due_date || "—"}</TableCell>

                <TableCell>
                  <Chip label={task.priority} size="small" />
                </TableCell>

                <TableCell>{task.board_title || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateTaskModal
        open={openCreateTask}
        onClose={() => setOpenCreateTask(false)}
        projectId={projectId}
        boardId={activeBoardId}
        refreshTasks={fetchTasks}
      />
    </Box>
  );
};

export default TaskList;

