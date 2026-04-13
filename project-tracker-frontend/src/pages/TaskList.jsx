import React, { useEffect, useState, useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CreateTaskModal from "../components/CreateTaskModal";
import { NotificationContext } from "../context/NotificationContext";

const TaskList = ({ deptId, teamId, projectId }) => {
  const { currentUser } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [openCreateTask, setOpenCreateTask] = useState(false);

  
  // FETCH TASKS
  
  const fetchTasks = async () => {
    try {
      let url;

      if (deptId && teamId) {
        url = `/api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}/task`;
      } else {
        url = `/api/v1/project/${projectId}/task`;
      }

      const res = await api.get(url);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Task fetch error:", err);
      setTasks([]);
    }
  };


  // FETCH BOARDS
  
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
    if (projectId) {
      fetchTasks();
      fetchBoards();
    }
  }, [deptId, teamId, projectId]);

 
  // NAVIGATION

  const goToTaskDetail = (taskId) => {
    navigate(`/project/${projectId}/task/${taskId}`);
  };


  //  FILTER TASKS (DATE BASED HACK)
  
  const today = new Date();

  const filteredTasks = tasks.filter((task) => {
    if (!task.start_date) return false;

    const start = new Date(task.start_date);

    // show only current + upcoming tasks (hide old/completed)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);

    return start >= twoDaysAgo;
  });

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">All Tasks</Typography>

        {currentUser?.job_profile?.toUpperCase() === "PROJECT MANAGER" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateTask(true)}
          >
            Create Task
          </Button>
        )}
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
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTasks.map((task) => (
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