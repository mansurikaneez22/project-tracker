import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

const TeamWorkload = ({ data = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const isEmpty = !data || data.length === 0;

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
        <Typography variant="h6" fontWeight={600}>
          Team Workload
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Active tasks per team member
        </Typography>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: isEmpty ? "center" : "stretch",
          justifyContent: "center",
        }}
      >
        {isEmpty ? (
          <Typography color="text.secondary">
            No workload data available
          </Typography>
        ) : (
          <BarChart
            dataset={data}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "name",
                tickLabelStyle: {
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: {
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                },
              },
            ]}
            series={[
              {
                dataKey: "tasks",
                label: "Tasks",
                color: theme.palette.primary.main,
              },
            ]}
            height={300}
            margin={{ top: 10, bottom: 50, left: 40, right: 10 }}
            grid={{ vertical: false, horizontal: true }}
            sx={{
              "& .MuiChartsAxis-line": {
                stroke: theme.palette.divider,
              },
              "& .MuiChartsGrid-line": {
                stroke: isDark ? "#1E293B" : "#E5E7EB",
              },
              "& .MuiBarElement-root": {
                rx: 6, // rounded bars (modern touch)
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default TeamWorkload;