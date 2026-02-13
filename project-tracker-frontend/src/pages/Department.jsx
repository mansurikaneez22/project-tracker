import React from "react";
import DepartmentList from "../components/DepartmentList";
import { Typography, Container, Box } from "@mui/material";

const Departments = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5, mb: 4 }}>
        <Typography variant="h5" fontWeight={600}>
          Departments
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Manage and explore all departments
        </Typography>
      </Box>

      <DepartmentList />
    </Container>
  );
};

export default Departments;
