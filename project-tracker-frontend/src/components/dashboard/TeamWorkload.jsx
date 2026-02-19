import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

const TeamWorkload = ({ data = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 3,
          p: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
          Team Workload
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
          No workload data available
        </Typography>
      </Box>
    );
  }

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
        Team Workload
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 3 }}
      >
        Active tasks per team member
      </Typography>

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
        height={280}
        margin={{ top: 10, bottom: 60, left: 40, right: 10 }}
        grid={{ vertical: false, horizontal: true }}
        sx={{
          "& .MuiChartsAxis-line": {
            stroke: theme.palette.divider,
          },
          "& .MuiChartsGrid-line": {
            stroke: isDark ? "#1E293B" : "#E5E7EB",
          },
        }}
      />
    </Box>
  );
};

export default TeamWorkload;
