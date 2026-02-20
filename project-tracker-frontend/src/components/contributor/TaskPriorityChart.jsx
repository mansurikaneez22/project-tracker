import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const TaskPriorityChart = ({ high = 4, medium = 2, low = 1 }) => {
  const data = [
    { id: 0, value: high, label: "High" },
    { id: 1, value: medium, label: "Medium" },
    { id: 2, value: low, label: "Low" },
  ];

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid #334155",
        backgroundColor: "#1e293b",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ mb: 2, color: "#fff" }}
        >
          Task Priority
        </Typography>

        <Box display="flex" justifyContent="center">
          <PieChart
            series={[
              {
                data,
                innerRadius: 55,
                outerRadius: 75,
                paddingAngle: 3,
                cornerRadius: 4,
              },
            ]}
            width={220}
            height={200}
            colors={["#ef4444", "#f59e0b", "#3b82f6"]}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskPriorityChart;
