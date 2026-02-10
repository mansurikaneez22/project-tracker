import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import api from "../services/api";

const WEEK_WIDTH = 120;

const ProjectTimeline = ({ deptId, teamId, projectId }) => {
  const [sprints, setSprints] = useState([]);
  const [timelineStart, setTimelineStart] = useState(null);
  const [timelineEnd, setTimelineEnd] = useState(null);

  useEffect(() => {
    if (!deptId || !teamId || !projectId) return;

    api
      .get(
        `/api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}/sprints`
      )
      .then((res) => {
        setSprints(res.data);

        const dates = res.data.flatMap((s) => [
          new Date(s.start_date),
          new Date(s.end_date)
        ]);

        setTimelineStart(new Date(Math.min(...dates)));
        setTimelineEnd(new Date(Math.max(...dates)));
      });
  }, [deptId, teamId, projectId]);

  if (!timelineStart || !timelineEnd) return null;

  const totalWeeks = Math.ceil(
    (timelineEnd - timelineStart) / (7 * 24 * 60 * 60 * 1000)
  );

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Project Timeline
      </Typography>

      {/* WEEK HEADER */}
      <Box display="flex" ml="220px" mb={2}>
        {Array.from({ length: totalWeeks }).map((_, i) => (
          <Box
            key={i}
            width={WEEK_WIDTH}
            textAlign="center"
            fontWeight="bold"
          >
            Week {i + 1}
          </Box>
        ))}
      </Box>

      {/* SPRINT LANES */}
      {sprints.map((sprint) => {
        const offset =
          (new Date(sprint.start_date) - timelineStart) /
          (7 * 24 * 60 * 60 * 1000);

        const duration =
          (new Date(sprint.end_date) - new Date(sprint.start_date)) /
          (7 * 24 * 60 * 60 * 1000);

        return (
          <Box key={sprint.sprint_id} display="flex" mb={3}>
            {/* Sprint Name */}
            <Box width={200}>
              <Typography fontWeight="bold">
                {sprint.sprint_name}
              </Typography>
            </Box>

            {/* Timeline Row */}
            <Box position="relative" flex={1} height={40}>
              <Box
                position="absolute"
                left={offset * WEEK_WIDTH}
                width={duration * WEEK_WIDTH}
                height={36}
                bgcolor="#1976d2"
                borderRadius={2}
                color="#fff"
                display="flex"
                alignItems="center"
                px={2}
              >
                {sprint.start_date} → {sprint.end_date}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProjectTimeline;
