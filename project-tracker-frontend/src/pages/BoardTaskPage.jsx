import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress
} from "@mui/material";
import api from "../services/api";
import TaskCard from "../components/Taskcard";

const BoardTaskPage = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch all boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await api.get("/api/v1/board");
        setBoards(res.data);
      } catch (err) {
        console.error("Error fetching boards", err);
      }
    };
    fetchBoards();
  }, []);

  //  fetch tasks when board changes
  useEffect(() => {
    if (!selectedBoard) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/v1/board_task_mapping/board/${selectedBoard}/task`
        );
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching board tasks", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedBoard]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Board Tasks
      </Typography>

      {/* Board Dropdown */}
      <Select
        fullWidth
        value={selectedBoard}
        onChange={(e) => setSelectedBoard(e.target.value)}
        displayEmpty
        sx={{ mb: 3 }}
      >
        <MenuItem value="" disabled>
          Select Board
        </MenuItem>
        {boards.map((board) => (
          <MenuItem key={board.board_id} value={board.board_id}>
            {board.board_name}
          </MenuItem>
        ))}
      </Select>

      {/* Tasks */}
      {loading ? (
        <CircularProgress />
      ) : tasks.length === 0 ? (
        <Typography>No tasks for this board</Typography>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.task_id} task={task} />
        ))
      )}
    </Box>
  );
};

export default BoardTaskPage;
