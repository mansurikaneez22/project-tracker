import { Box, Typography, Grid, Paper } from "@mui/material";

const TLDashboard = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Team Lead Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>Total Tasks</Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>In Progress</Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>Completed</Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>Blocked</Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TLDashboard;
