import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/* ---------- Helpers ---------- */

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const getSprintStatus = (start, end) => {
  if (!start || !end) return "UPCOMING";

  const now = new Date();
  if (now < new Date(start)) return "UPCOMING";
  if (now > new Date(end)) return "COMPLETED";
  return "ACTIVE";
};

const statusColor = {
  ACTIVE: "success",
  UPCOMING: "info",
  COMPLETED: "default"
};

/* ---------- Component ---------- */

const SprintBoards = ({ sprints = [], departmentId, teamId, projectId }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Sprint Boards
        </Typography>

        <Button variant="contained" sx={{ borderRadius: 2 }}>
          + Add Sprint
        </Button>
      </Box>

      <Stack spacing={2}>
        {sprints.length === 0 && (
          <Typography color="text.secondary">
            No sprints created yet.
          </Typography>
        )}

        {sprints.map((sprint) => {
          const status = getSprintStatus(
            sprint.start_date,
            sprint.end_date
          );

          return (
            <Card
              key={sprint.sprint_id}
              sx={{
                borderRadius: 3,
                transition: "0.2s",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)"
                }
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="h6" fontWeight={600}>
                    {sprint.sprint_name}
                  </Typography>

                  <Chip
                    label={status}
                    color={statusColor[status] || "default"}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  {sprint.description || "No description"}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {formatDate(sprint.start_date)} →{" "}
                  {formatDate(sprint.end_date)}
                </Typography>

                <Box mt={2}>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate(
                        `/project/${projectId}/sprint/${sprint.sprint_id}`
                      )
                    }
                  >
                    Open Board →
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default SprintBoards;
