import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Draggable } from "@hello-pangea/dnd";

/* ---------- Status Color ---------- */
const statusColor = (status) => {
  switch (status) {
    case "TODO":
      return "default";
    case "IN_PROGRESS":
      return "warning";
    case "DONE":
      return "success";
    default:
      return "default";
  }
};

/* ---------- Priority Color ---------- */
const priorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "error";
    case "Medium":
      return "warning";
    case "Low":
      return "success";
    default:
      return "default";
  }
};

/* ===================================================== */
/* ================= TaskCardContent =================== */
/* ===================================================== */

const TaskCardContent = ({ task, assignees, navigate }) => {


  const assigneeName =
    assignees?.find((u) => u.user_id === task.assignee_id)?.user_name ||
    "None";

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // ✅ Correct nested route
    navigate(
  `/project/${task.project_id}/task/${task.task_id}`,
   {
    state: {
     
      projectName: task.project_name,
    }
  }

);

  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        mb: 2,
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": { boxShadow: 6 }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6" fontWeight={600}>
            {task.task_title}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Chip
              label={task.status}
              color={statusColor(task.status)}
              size="small"
            />
            <Chip
              label={task.priority}
              color={priorityColor(task.priority)}
              size="small"
            />
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {task.task_description}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Typography variant="caption">
            👤 {assigneeName}
          </Typography>

          <Typography variant="caption">
            🗓️ {task.start_date?.slice(0, 10)}
          </Typography>

          <Typography variant="caption">
            ⏰ {task.due_date?.slice(0, 10)}
          </Typography>

          <Typography variant="caption">
            ⭐ {task.estimation_points}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

/* ===================================================== */
/* ===================== TaskCard ====================== */
/* ===================================================== */

const TaskCard = ({ task, index, assignees = [], draggable = false }) => {
  const navigate = useNavigate();

  if (!draggable) {
    return (
      <TaskCardContent
        task={task}
        assignees={assignees}
        navigate={navigate}
      />
    );
  }

  return (
    <Draggable
  draggableId={task.task_id.toString()}
  index={index}
>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TaskCardContent
            task={task}
            assignees={assignees}
            navigate={navigate}
          />
        </Box>
      )}
    </Draggable>
  );
};

export default TaskCard;
