import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const TeamWorkload = ({ data = [] }) => {
  console.log("TeamWorkload Props:", data);

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
  dataset={data}
  xAxis={[
    {
      scaleType: "band",
      dataKey: "name",
    },
  ]}
  series={[
    {
      dataKey: "tasks",
      label: "Tasks",
    },
  ]}
  height={300}
  margin={{ top: 20, bottom: 60, left: 40, right: 10 }}
/>


    </Box>
  );
};

export default TeamWorkload;
