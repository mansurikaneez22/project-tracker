import React from "react";
import DepartmentList from "../components/DepartmentList";
import { Typography, Container, Box } from "@mui/material";

const Departments = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" gutterBottom>
            Departments
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Manage and explore all departments across your organization.
          </Typography>
        </Box>

        <DepartmentList />
      </Container>
    </Box>
  );
};

export default Departments;
