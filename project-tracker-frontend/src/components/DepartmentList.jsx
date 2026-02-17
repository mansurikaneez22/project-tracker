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
  <Grid container spacing={4}>
    {departments.map((dept) => (
      <Grid item xs={12} sm={6} md={4} key={dept.department_id}>
        <Card
          onClick={() =>
            navigate(`/department/${dept.department_id}/team`)
          }
          sx={{
            cursor: "pointer",
            height: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 3,
            transition: "all 0.3s ease",
            border: "1px solid",
            borderColor: "divider",

            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: 8,
              borderColor: "primary.main",
            },
          }}
        >
          {/* Top Section */}
          <Box>
            <Typography
              variant="h6"
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

          {/* Bottom Section */}
          <Chip
            label={dept.department_type}
            size="small"
            sx={{
              alignSelf: "flex-start",
              fontWeight: 600,
              backgroundColor: "primary.main",
              color: "background.default",
            }}
          />
        </Card>
      </Grid>
    ))}
  </Grid>
);

}

export default DepartmentList;
