import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip
} from "@mui/material";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    api.get("http://127.0.0.1:8000/api/v1/department", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      setDepartments(res.data);   // ✅ FIX: response ko state me set kiya
    })
    .catch((err) => {
      console.error("Error fetching departments", err);
    });
  }, []);

  return (
  <Grid container spacing={3}>
    {departments.map((dept) => (
      <Grid item xs={12} sm={6} md={4} key={dept.department_id}>
        <Card
          onClick={() =>
            navigate(`/department/${dept.department_id}/team`)
          }
          sx={{
            cursor: "pointer",
            height: 150,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2.5,
            transition: "all 0.25s ease",
            border: "1px solid",
            borderColor: "divider",

            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: 6,
              borderColor: "primary.main",
            },
          }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 1 }}
            >
              {dept.department_name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Department Overview
            </Typography>
          </Box>

          <Chip
            label={dept.department_type}
            size="small"
            color={
              dept.department_type === "Technical"
                ? "primary"
                : "secondary"
            }
            sx={{ alignSelf: "flex-start" }}
          />
        </Card>
      </Grid>
    ))}
  </Grid>
);

}

export default DepartmentList;
