import { Card, Box, Typography } from "@mui/material";

const StatCard = ({ title, value }) => {
  return (
    <Card sx={{ borderRadius: 3, padding: 2, textAlign: "center" }}>
      <Box
        sx={{
          margin: "0 auto",
          borderRadius: "50%",
          height: 100,
          width: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {value}
        </Typography>
        <Typography variant="body2">{title}</Typography>
      </Box>
    </Card>
  );
};

export default StatCard;
