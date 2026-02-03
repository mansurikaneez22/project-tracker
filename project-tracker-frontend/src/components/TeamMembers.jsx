import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell,
  TableHead, TableRow, Paper, Typography
} from "@mui/material";
import api from "../services/api";

const TeamMembers = ({ departmentId, teamId, projectId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!departmentId || !teamId || !projectId) return;

    api
      .get(`/api/v1/department/${departmentId}/team/${teamId}/project/${projectId}/members/`)
      .then((res) => setMembers(res.data))
      .catch(err => console.error("Failed to fetch project members:", err));
  }, [departmentId, teamId, projectId]);

  return (
    <Paper sx={{ p: 2, mt: 2, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Project Members
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No members found
              </TableCell>
            </TableRow>
          ) : (
            members.map((m) => (
              <TableRow key={m.user_id}>
                <TableCell>{m.user_id}</TableCell>
                <TableCell>{m.user_name}</TableCell>
                <TableCell>{m.email_id}</TableCell>
                <TableCell>{m.role_type}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TeamMembers;
