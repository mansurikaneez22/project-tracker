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
import { useParams } from "react-router-dom";
import api from "../services/api";
import CreateTaskModal from "../components/CreateTaskModal";

const TaskList = () => {
  const { departmentId, teamId, projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [openCreateTask, setOpenCreateTask] = useState(false);

  // ===============================
  // FETCH TASKS (BY PROJECT)
  // ===============================
  // ===============================
// FETCH TASKS (BY PROJECT)
// ===============================
const fetchTasks = async () => {
  if (!departmentId || !teamId || !projectId) return;

  try {
    const res = await api.get(
      `/api/v1/project/department/${departmentId}/team/${teamId}/project/${projectId}/task`
    );

    // ✅ CORRECT
    setTasks(res.data.tasks || []);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    setTasks([]);
  }
};


  // ===============================
  // FETCH BOARDS (SPRINTS)
  // ===============================
  const fetchBoards = async () => {
    try {
      const res = await api.get(
        `/api/v1/board/project/${projectId}`
      );

      const boardList = res.data || [];
      setBoards(boardList);

      // ✅ select first board as active sprint
      if (boardList.length > 0) {
        setActiveBoardId(boardList[0].board_id);
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
    }
  };
useEffect(() => {
  if (departmentId && teamId && projectId) {
    fetchTasks();
    fetchBoards();
  }
}, [departmentId, teamId, projectId]);


  return (
    <Box p={3}>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">All Tasks</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateTask(true)}
        
        >
          Create Task
        </Button>

      </Box>

      {/* TABLE */}
      {tasks.length === 0 ? (
        <Typography>No tasks for this project</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Task Title</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Sprint</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.task_id} hover>
                  <TableCell>{task.task_id}</TableCell>
                  <TableCell>{task.task_title}</TableCell>
                  <TableCell>{task.assignee_name || "—"}</TableCell>
                  <TableCell>{task.start_date || "—"}</TableCell>
                  <TableCell>{task.due_date || "—"}</TableCell>

                  <TableCell>
                    <Chip
                      label={task.priority}
                      size="small"
                      color={
                        task.priority === "High"
                          ? "error"
                          : task.priority === "Medium"
                          ? "warning"
                          : "success"
                      }
                    />
                  </TableCell>

                  {/* ✅ SPRINT NAME COMES FROM BACKEND JOIN */}
                  <TableCell>{task.board_title || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* CREATE TASK MODAL */}
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
