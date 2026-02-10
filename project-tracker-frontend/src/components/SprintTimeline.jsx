import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import api from "../services/api";

const WEEK_WIDTH = 120;
const ROW_HEIGHT = 42;

const SprintTimeline = ({ deptId, teamId, projectId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api
      .get(
        `/api/v1/project/department/${deptId}/team/${teamId}/project/${projectId}/timeline`
      )
      .then(res => setTasks(res.data))
      .catch(console.error);
  }, [deptId, teamId, projectId]);

  if (!tasks.length) return <Typography>No data</Typography>;

   const minDate = tasks.reduce(
  (min, t) => (dayjs(t.start).isBefore(min) ? dayjs(t.start) : min),
  dayjs(tasks[0].start)
);

const maxDate = tasks.reduce(
  (max, t) =>
    dayjs(t.end || t.start).isAfter(max)
      ? dayjs(t.end || t.start)
      : max,
  dayjs(tasks[0].end || tasks[0].start)
);


  const weeks = [];
  let cursor = minDate.startOf("week");

  while (cursor.isBefore(maxDate)) {
    weeks.push(cursor);
    cursor = cursor.add(1, "week");
  }

  return (
    <Box sx={{ overflowX: "auto" }}>
      {/* HEADER */}
      <Box display="flex">
        <Box width={220} />
        {weeks.map((week, i) => (
          <Box
            key={i}
            width={WEEK_WIDTH}
            textAlign="center"
            fontWeight={600}
          >
            {week.format("DD MMM")}
          </Box>
        ))}
      </Box>

      {/* ROWS */}
      {tasks.map(task => {
        const startWeekIndex = dayjs(task.start)
          .startOf("week")
          .diff(weeks[0], "week");

        const durationWeeks =
          dayjs(task.end || task.start)
            .endOf("week")
            .diff(dayjs(task.start).startOf("week"), "week") + 1;

        return (
          <Box key={task.task_id} display="flex" alignItems="center">
            <Box width={220}>
              <Typography fontSize={14}>
                {task.title}
              </Typography>
            </Box>

            <Box position="relative" height={ROW_HEIGHT} flex={1}>
              <Box
                sx={{
                  position: "absolute",
                  left: startWeekIndex * WEEK_WIDTH,
                  width: durationWeeks * WEEK_WIDTH,
                  height: 20,
                  backgroundColor:
                    task.status === "DONE"
                      ? "#2e7d32"
                      : task.status === "IN_PROGRESS"
                      ? "#ed6c02"
                      : "#90a4ae",
                  borderRadius: 1
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default SprintTimeline;
