import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import BoardCard from "./BoardCard";
import api from "../services/api";

const BoardList = ({ deptId, teamId, projectId, refresh }) => {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  const fetchBoards = useCallback(async () => {
    try {
      const res = await api.get(
        `/api/v1/board/project/${projectId}`
      );

      // backend aligned response
      setBoards(res.data.boards || []);
    } catch (err) {
      console.error("Error fetching boards:", err);
      setBoards([]);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchBoards();
    }
  }, [projectId, refresh, fetchBoards]);

  /* ===== EMPTY STATE ===== */
  if (!boards.length) {
    return (
      <Typography
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        No sprint boards yet. Create one to start tracking tasks 🚀
      </Typography>
    );
  }

  /* ===== BOARD LIST ===== */
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {boards.map((board) => (
        <Box
          key={board.board_id}
          sx={{
            cursor: "pointer"
          }}
          onClick={() =>
            navigate(
  `/department/${deptId}/team/${teamId}/project/${projectId}/board/${board.board_id}`
)

          }
        >
          <BoardCard board={board} />
        </Box>
      ))}
    </Box>
  );
};

export default BoardList;
