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
        borderRadius: 4,
        p: 4,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.25s ease",

        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: "primary.main",
          boxShadow: isDark
            ? "0 15px 40px rgba(96,165,250,0.25)"
            : "0 12px 30px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Task Overview
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Status wise breakdown of tasks
        </Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={5}
          alignItems="center"
        >
          {/* Chart Section */}
          <Box sx={{ position: "relative", width: 220, height: 220 }}>
            <PieChart
              series={[
                {
                  innerRadius: 75,
                  outerRadius: 100,
                  paddingAngle: 3,
                  cornerRadius: 6,
                  data: [
                    {
                      value: safeTodo,
                      color: isDark ? "#64748B" : "#CBD5E1",
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
                },
              ]}
              width={220}
              height={220}
              slotProps={{ legend: { hidden: true } }}
            />

            {/* Center Content */}
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
                  sx={{ fontWeight: 700 }}
                >
                  {total}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Total Tasks
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Legend Section */}
          <Stack spacing={2} minWidth={140}>
            <Legend
              color={isDark ? "#64748B" : "#CBD5E1"}
              label="To Do"
              value={safeTodo}
            />
            <Legend
              color={theme.palette.primary.main}
              label="In Progress"
              value={safeInProgress}
            />
            <Legend
              color="#22C55E"
              label="Completed"
              value={safeDone}
            />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

const Legend = ({ color, label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
      <Typography fontSize={14} fontWeight={500}>
        {label}
      </Typography>
    </Stack>

    <Typography fontWeight={600}>{value}</Typography>
  </Box>
);

export default TaskOverview;