import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import TaskCard from "./Taskcard";
import CreateTaskModal from "./CreateTaskModal";
import api from "../services/api";

const BoardTaskList = () => {
  const { deptId, teamId, projectId, boardId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [open, setOpen] = useState(false);

  /* ================= PROJECT MEMBERS ================= */
  const fetchProjectMembers = useCallback(async () => {
    if (!deptId || !teamId || !projectId) return;

    try {
      const res = await api.get(
        `/api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}/members`
      );
      setAssignees(res.data || []);
    } catch (err) {
      console.error("Failed to fetch project members:", err);
      setAssignees([]);
    }
  }, [deptId, teamId, projectId]);

  /* ================= BOARD TASKS ================= */
  const fetchTasks = useCallback(async () => {
    if (!boardId) return;

    try {
      const res = await api.get(
        `/api/v1/board_task_mapping/board/${boardId}/task`
      );
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch board tasks:", err);
      setTasks([]);
    }
  }, [boardId]);

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchProjectMembers();
    fetchTasks();
  }, [fetchProjectMembers, fetchTasks]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Board Tasks</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Task
        </Button>
      </Box>

      {tasks.length === 0 && (
        <Typography>No tasks in this board</Typography>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task.task_id}
          task={task}
          assignees={assignees}
        />
      ))}

      <CreateTaskModal
        open={open}
        onClose={() => setOpen(false)}
        projectId={projectId}
        boardId={boardId}
        refreshTasks={fetchTasks}
      />
    </Box>
  );
};

export default BoardTaskList;
