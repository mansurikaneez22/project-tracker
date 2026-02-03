import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import api from "../services/api";

/* ================= STATUS ICON ================= */
const StatusStepIcon = ({ active, completed, icon }) => {
  let color = "#cfcfcf";
  let Icon = RadioButtonUncheckedIcon;

  if (icon === 1) {
    color = active || completed ? "#d32f2f" : "#cfcfcf"; // TO DO
  }

  if (icon === 2) {
    color = active || completed ? "#f9a825" : "#cfcfcf"; // IN PROGRESS
    Icon = HourglassBottomIcon;
  }

  if (icon === 3) {
    color = active || completed ? "#2e7d32" : "#cfcfcf"; // DONE
    Icon = CheckCircleIcon;
  }

  return <Icon sx={{ color }} />;
};

/* ================= COMPONENT ================= */
const ProjectTimeline = ({ deptId, teamId, projectId }) => {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    if (!deptId || !teamId || !projectId) return;

    api
      .get(
        `/api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}/timeline`

      )
      .then((res) => {
        console.log("TIMELINE API RESPONSE:", res.data);
        setTimeline(res.data);
      })
      .catch((err) => {
        console.error("Timeline error:", err);
      });
  }, [deptId, teamId, projectId]);

  if (timeline.length === 0) {
    return <Typography>No timeline data</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Project Timeline
      </Typography>

      {timeline.map((task) => {
        const activeStep =
          task.status === "TO DO"
            ? 0
            : task.status === "IN PROGRESS"
            ? 1
            : 2;

        return (
          <Box key={task.task_id} mb={4}>
            <Typography fontWeight="bold" mb={1}>
              {task.title}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color:
                  task.status === "TO DO"
                    ? "#d32f2f"
                    : task.status === "IN PROGRESS"
                    ? "#f9a825"
                    : "#2e7d32",
                fontWeight: "bold",
                textTransform: "uppercase"
              }}
            >
              Current Status: {task.status}
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel>
              <Step>
                <StepLabel StepIconComponent={StatusStepIcon}>
                  TO DO
                </StepLabel>
              </Step>
              <Step>
                <StepLabel StepIconComponent={StatusStepIcon}>
                  IN PROGRESS
                </StepLabel>
              </Step>
              <Step>
                <StepLabel StepIconComponent={StatusStepIcon}>
                  DONE
                </StepLabel>
              </Step>
            </Stepper>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProjectTimeline;
