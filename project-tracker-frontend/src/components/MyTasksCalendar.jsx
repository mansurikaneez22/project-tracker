import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Grid,
  Card,
  Stack,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";

const MyTasksCalendar = ({ tasks = [] }) => {
  const theme = useTheme();
  const [currentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

  /* ================= STATUS COLORS ================= */

  const getStatusStyles = (status) => {
    switch (status) {
      case "Todo":
        return { accent: theme.palette.grey[500] };
      case "In Progress":
        return { accent: theme.palette.primary.main };
      case "Done":
        return { accent: theme.palette.success.main };
      case "Blocked":
        return { accent: theme.palette.error.main };
      default:
        return { accent: theme.palette.info.main };
    }
  };

  /* ================= GROUP TASKS ================= */

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      const key = dayjs(task.due_date).format("YYYY-MM-DD");
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [tasks]);

  const upcomingTasks = tasks
    .filter((t) => dayjs(t.due_date).isAfter(dayjs(), "day"))
    .sort((a, b) => dayjs(a.due_date) - dayjs(b.due_date))
    .slice(0, 5);

  /* ================= CALENDAR RANGE ================= */

  const startOfMonth = currentMonth.startOf("month").startOf("week");
  const endOfMonth = currentMonth.endOf("month").endOf("week");

  const days = [];
  let day = startOfMonth;

  while (day.isBefore(endOfMonth)) {
    days.push(day);
    day = day.add(1, "day");
  }

  const selectedKey = selectedDate.format("YYYY-MM-DD");
  const selectedTasks = tasksByDate[selectedKey] || [];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Grid container spacing={3}>
      {/* ================= CALENDAR ================= */}
      <Grid item xs={12} md={8}>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={3}>
            {currentMonth.format("MMMM YYYY")}
          </Typography>

          {/* Week Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              mb: 1.5,
            }}
          >
            {weekDays.map((day) => (
              <Typography
                key={day}
                align="center"
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>

          {/* Calendar Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1.5,
            }}
          >
            {days.map((date) => {
              const key = date.format("YYYY-MM-DD");
              const dayTasks = tasksByDate[key] || [];
              const isSelected = date.isSame(selectedDate, "day");
              const isToday = date.isSame(dayjs(), "day");
              const isCurrentMonth = date.month() === currentMonth.month();

              return (
                   <Box
  key={key}
  onClick={() => setSelectedDate(date)}
  sx={{
    aspectRatio: "1 / 1",   // 🔥 makes perfect square
    p: 1.2,
    borderRadius: 2,        // small radius, not pill
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    background: isSelected
      ? theme.palette.primary.main + "15"
      : theme.palette.background.paper,
    border: isToday
      ? `1px solid ${theme.palette.primary.main}`
      : `1px solid ${theme.palette.divider}`,
    opacity: isCurrentMonth ? 1 : 0.35,
    transition: "0.2s ease",
    "&:hover": {
      background: theme.palette.action.hover,
    },
  }}
>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color={
                      isToday
                        ? "primary.main"
                        : theme.palette.text.primary
                    }
                  >
                    {date.date()}
                  </Typography>

                  {/* Tasks */}
                  <Box mt={1}>
                    {dayTasks.slice(0, 2).map((task) => {
                      const status = getStatusStyles(task.status);
                      return (
                        <Box
                          key={task.id}
                          sx={{
                            mt: 0.7,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                            px: 1,
                            py: 0.5,
                            borderRadius: 2,
                            background: theme.palette.grey[100],
                            fontSize: 11,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: status.accent,
                              flexShrink: 0,
                            }}
                          />

                          <Typography
                            variant="caption"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {task.title}
                          </Typography>
                        </Box>
                      );
                    })}

                    {dayTasks.length > 2 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        +{dayTasks.length - 2} more
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Selected Date Tasks */}
          <Box mt={4}>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Tasks for {selectedDate.format("MMM DD, YYYY")}
            </Typography>

            {selectedTasks.length === 0 ? (
              <Typography color="text.secondary">
                No tasks scheduled
              </Typography>
            ) : (
              selectedTasks.map((task) => {
                const status = getStatusStyles(task.status);
                return (
                  <Card
                    key={task.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      borderLeft: `4px solid ${status.accent}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography fontWeight={600}>
                          {task.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {task.priority}
                        </Typography>
                      </Box>

                      <Chip
                        label={task.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                  </Card>
                );
              })
            )}
          </Box>
        </Card>
      </Grid>

      {/* ================= UPCOMING ================= */}
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            Upcoming
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {upcomingTasks.length === 0 ? (
            <Typography color="text.secondary">
              No upcoming tasks
            </Typography>
          ) : (
            upcomingTasks.map((task) => {
              const status = getStatusStyles(task.status);
              return (
                <Box
                  key={task.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 3,
                    background: theme.palette.background.default,
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <Typography fontWeight={600}>
                    {task.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {dayjs(task.due_date).format("MMM DD")}
                  </Typography>

                  <Box
                    sx={{
                      mt: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.8,
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 20,
                      background: theme.palette.grey[100],
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: status.accent,
                      }}
                    />
                    {task.status}
                  </Box>
                </Box>
              );
            })
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default MyTasksCalendar;
