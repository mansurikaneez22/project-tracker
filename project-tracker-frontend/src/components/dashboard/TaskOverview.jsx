import { Card, CardContent, Typography, Box } from "@mui/material";

const TaskOverview = ({ data }) => {
  return (
    <Card sx={{ borderRadius: 3, width: "100%", minHeight: 180 }}>
      <CardContent>
        <Typography fontWeight={600} mb={2}>
          Task Overview
        </Typography>

        {Object.entries(data).map(([status, count]) => (
          <Box
            key={status}
            display="flex"
            justifyContent="space-between"
            mb={1}
          >
            <Typography>{status.replace("_", " ")}</Typography>
            <Typography fontWeight={600}>{count}</Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskOverview;
