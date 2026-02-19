import { Box, Typography, Stack } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "@mui/material/styles";

const TaskOverview = ({ todo = 0, inProgress = 0, done = 0 }) => {
  const theme = useTheme();

  const safeTodo = Number(todo) || 0;
  const safeInProgress = Number(inProgress) || 0;
  const safeDone = Number(done) || 0;

  const total = safeTodo + safeInProgress + safeDone;

  const isDark = theme.palette.mode === "dark";

  return (
    <Box
       sx={{
    backgroundColor: "background.paper",
    borderRadius: 3,
    p: 3,
    border: "1px solid",
    borderColor: "divider",
    height: "100%",
    transition: "all 0.25s ease",
    cursor: "default",

    "&:hover": {
      transform: "translateY(-6px)",
      borderColor: "primary.main",
      boxShadow: (theme) =>
        theme.palette.mode === "dark"
          ? "0 15px 40px rgba(96,165,250,0.25)"
          : "0 12px 30px rgba(0,0,0,0.08)",
    },
  }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "text.primary" }}
      >
        Task Overview
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 3 }}
      >
        Status wise breakdown of tasks
      </Typography>

      <Stack
        direction="row"
        spacing={4}
        alignItems="center"
        flexWrap="wrap"
      >
        {/* Chart */}
        <Box sx={{ position: "relative", width: 220, height: 220 }}>
          <PieChart
            series={[
              {
                innerRadius: 70,
                outerRadius: 100,
                paddingAngle: 2,
                data: [
                  {
                    value: safeTodo,
                    color: isDark ? "#94A3B8" : "#CBD5E1",
                  },
                  {
                    value: safeInProgress,
                    color: theme.palette.primary.main,
                  },
                  {
                    value: safeDone,
                    color: "#22C55E",
                  },
                ],
                arcLabel: () => "",
              },
            ]}
            width={220}
            height={220}
            slotProps={{ legend: { hidden: true } }}
          />

          {/* Center Text */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box textAlign="center">
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                {total}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: "text.secondary" }}
              >
                Total Tasks
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Legend */}
        <Stack spacing={2}>
          <Legend
            color={isDark ? "#94A3B8" : "#CBD5E1"}
            label="TODO"
            value={safeTodo}
          />
          <Legend
            color={theme.palette.primary.main}
            label="IN PROGRESS"
            value={safeInProgress}
          />
          <Legend
            color="#22C55E"
            label="DONE"
            value={safeDone}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

const Legend = ({ color, label, value }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: color,
      }}
    />
    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 500,
        color: "text.primary",
      }}
    >
      {label} — {value}
    </Typography>
  </Stack>
);

export default TaskOverview;
