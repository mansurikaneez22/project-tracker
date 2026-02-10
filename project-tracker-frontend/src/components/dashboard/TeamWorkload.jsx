import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const TeamWorkload = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No workload data available
      </Typography>
    );
  }

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
        Team Workload
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Active tasks per team member
      </Typography>

      <BarChart
        height={Math.max(280, data.length * 45)}
        series={[
          {
            data: data.map((d) => d.tasks ?? 0), // fixed field
            label: "Tasks",
            color: "#1e88e5",
            valueFormatter: (v) => `${v}`,
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            data: data.map((d, i) => {
              const name = d.name ?? `User ${i + 1}`; // default name if missing
              return name.length > 10 ? name.slice(0, 10) + "…" : name;
            }),
            tickLabelStyle: {
              fontSize: 12,
              angle: -30,
              textAnchor: "end",
            },
          },
        ]}
        yAxis={[{ tickMinStep: 1 }]}
        margin={{ top: 20, bottom: 70, left: 40, right: 20 }}
        slotProps={{ axisTooltip: { trigger: "none" } }}
      />
    </Box>
  );
};

export default TeamWorkload;
