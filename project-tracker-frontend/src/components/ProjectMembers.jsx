import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";
import axios from "axios";

const rolePriority = {
  "PROJECT MANAGER": 1,
  "PRODUCT MANAGER": 1,
  "TEAM LEADER": 2,
  "CONTRIBUTOR": 3
};

const ProjectMembers = ({ deptId, teamId, projectId }) => {
  const [members, setMembers] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState(3);
  const [loading, setLoading] = useState(false);
  const [myProjectRole, setMyProjectRole] = useState(null);

  const token = localStorage.getItem("token");
  const myUserId = Number(localStorage.getItem("user_id"));

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  /* ================= FETCH PROJECT MEMBERS ================= */
  const fetchProjectMembers = async () => {
    try {
      if (!deptId || !teamId || !projectId) {
        console.warn("Missing IDs", { deptId, teamId, projectId });
        return;
      }

      if (!token) {
        console.error("Token missing");
        return;
      }

      const res = await axios.get(
        `http://127.0.0.1:8000/api/v1/department/${deptId}/team/${teamId}/project/${projectId}/members/`,
        authHeader
      );

      setMembers(res.data || []);

      const me = res.data?.find(m => m.user_id === myUserId);
      if (me) setMyProjectRole(me.role_type);
    } catch (err) {
      console.error(
        "Error fetching project members:",
        err.response?.data || err.message
      );
    }
  };

  /* ================= FETCH TEAM USERS ================= */
  const fetchTeamUsers = async () => {
    try {
      if (!deptId || !teamId) return;

      const res = await axios.get(
        `http://127.0.0.1:8000/api/v1/department/${deptId}/team/${teamId}/members`,
        authHeader
      );

      setTeamUsers(res.data || []);
    } catch (err) {
      console.error(
        "Error fetching team users:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    if (deptId && teamId && projectId) {
      fetchProjectMembers();
      fetchTeamUsers();
    }
  }, [deptId, teamId, projectId]);

  /* ================= PERMISSION ================= */
  const canManageMembers =
    myProjectRole === "PROJECT MANAGER" ||
    myProjectRole === "PRODUCT MANAGER" ||
    myProjectRole === "TEAM LEADER";

  /* ================= SORT ================= */
  const sortedMembers = [...members].sort(
    (a, b) => rolePriority[a.role_type] - rolePriority[b.role_type]
  );

  /* ================= ADD MEMBER ================= */
  const handleAddMember = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/v1/department/${deptId}/team/${teamId}/project/${projectId}/members`,
        {
          user_id: Number(userId),
          role_id: Number(roleId)
        },
        authHeader
      );

      setUserId("");
      setRoleId(3);
      fetchProjectMembers();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Project Members
      </Typography>

      {/* ===== ADD MEMBER ===== */}
      {canManageMembers && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" gap={2}>
            <Select
              size="small"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              displayEmpty
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">Select User</MenuItem>
              {teamUsers.map((u) => (
                <MenuItem key={u.user_id} value={u.user_id}>
                  {u.user_name}
                </MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <MenuItem value={1}>Project Manager</MenuItem>
              <MenuItem value={2}>Team Leader</MenuItem>
              <MenuItem value={3}>Contributor</MenuItem>
            </Select>

            <Button
              variant="contained"
              onClick={handleAddMember}
              disabled={loading}
            >
              Add
            </Button>
          </Box>
        </Paper>
      )}

      {/* ===== MEMBERS TABLE ===== */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedMembers.map((m) => (
              <TableRow key={m.user_id}>
                <TableCell>{m.user_id}</TableCell>
                <TableCell>{m.user_name}</TableCell>
                <TableCell>{m.email_id}</TableCell>
                <TableCell>{m.role_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ProjectMembers;
