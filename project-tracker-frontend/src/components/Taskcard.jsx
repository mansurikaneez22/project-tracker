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

const statusColor = (status) => {
  switch (status) {
    case "TODO":
      return "default";
    case "IN PROGRESS":
      return "warning";
    case "DONE":
      return "success";
    default:
      return "default";
  }
};

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

const TaskCard = ({ task, index, assignees = [] }) => {
  const navigate = useNavigate();

  const assigneeName =
    assignees.find((u) => u.user_id === task.assignee_id)?.user_name || "None";

  return (
    <Draggable draggableId={task.task_id.toString()} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            mb: 2,
            borderRadius: 2,
            "&:hover": { boxShadow: 6 }
          }}
        >
          <CardContent>
            {/* HEADER = DRAG HANDLE */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
              {...provided.dragHandleProps}
              sx={{ cursor: "grab" }}
            >
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

            {/* BODY (same as before) */}
            <Box
              onClick={() => navigate(`/task/${task.task_id}`)}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="body2" color="text.secondary" mb={1}>
                {task.task_description}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Box
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1}
              >
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
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;
