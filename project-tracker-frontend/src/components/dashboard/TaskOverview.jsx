import { Box, Typography, Stack } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const TaskOverview = ({ todo = 0, inProgress = 0, done = 0 }) => {
  const safeTodo = Number(todo) || 0;
  const safeInProgress = Number(inProgress) || 0;
  const safeDone = Number(done) || 0;

  const total = safeTodo + safeInProgress + safeDone;

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "24px",
        p: 3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Task Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Status wise breakdown of tasks
      </Typography>

      <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap">
        {/* Chart */}
        <Box sx={{ position: "relative", width: 220, height: 220 }}>
          <PieChart
            series={[
              {
                innerRadius: 70,
                outerRadius: 100,
                paddingAngle: 2,
                data: [
                  { value: safeTodo, color: "#b0bec5" },
                  { value: safeInProgress, color: "#1e88e5" },
                  { value: safeDone, color: "#2e7d32" },
                ],
                arcLabel: () => "",
              },
            ]}
            width={220}
            height={220}
            slotProps={{
              legend: { hidden: true }, // 🔥 REAL FIX
            }}
          />

          {/* Center text */}
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
              <Typography variant="h4" fontWeight={700}>
                {total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Tasks
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Custom Legend */}
        <Stack spacing={2}>
          <Legend color="#b0bec5" label="TODO" value={safeTodo} />
          <Legend color="#1e88e5" label="IN PROGRESS" value={safeInProgress} />
          <Legend color="#2e7d32" label="DONE" value={safeDone} />
        </Stack>
      </Stack>
    </Box>
  );
};

const Legend = ({ color, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="center">
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
        lineHeight: "20px", // 🔥 prevents text overlap
        display: "block",
      }}
    >
      {label} {value}
    </Typography>
  </Stack>
);

export default TaskOverview;
