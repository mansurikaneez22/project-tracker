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
  "TEAM LEADER": 2,
  "CONTRIBUTOR": 3
};

const ProjectMembers = ({ projectId }) => {
  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState(3);
  const [loading, setLoading] = useState(false);
  const [myProjectRole, setMyProjectRole] = useState(null);

  const token = localStorage.getItem("token");
  const myUserId = Number(localStorage.getItem("user_id"));

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // ================= FETCH MEMBERS =================
  const fetchMembers = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/v1/project-members/project/${projectId}`,
      authHeader
    );

    setMembers(res.data);

    // find current user's role IN THIS PROJECT
    const myRecord = res.data.find((m) => m.user_id === myUserId);

    if (myRecord) {
      setMyProjectRole(myRecord.role_type);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  // ================= PERMISSION =================
  const canManageMembers =
    myProjectRole === "PROJECT MANAGER" ||
    myProjectRole === "PRODUCT MANAGER" ||
    myProjectRole === "TEAM LEADER";

  // ================= SORT MEMBERS =================
  const sortedMembers = [...members].sort(
    (a, b) => rolePriority[a.role_type] - rolePriority[b.role_type]
  );

  // ================= ADD MEMBER =================
  const handleAddMember = async () => {
    if (!userId) return;

    setLoading(true);
    await axios.post(
      "http://127.0.0.1:8000/api/v1/project-members",
      {
        project_id: projectId,
        user_id: userId,
        role_id: roleId
      },
      authHeader
    );
    setLoading(false);
    fetchMembers();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Project Members
      </Typography>

      {/* ===== ADD MEMBER BOX ===== */}
      {canManageMembers && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" gap={2}>
            <Select
              size="small"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select User</MenuItem>
              {/* team users dropdown later */}
            </Select>

            <Select
              size="small"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <MenuItem value={1}>PM</MenuItem>
              <MenuItem value={2}>TL</MenuItem>
              <MenuItem value={3}>Contributor</MenuItem>
            </Select>

            <Button
              variant="contained"
              onClick={handleAddMember}
              disabled={loading}
            >
              Add Member
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
