import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Box,
  IconButton,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";

/* ===== ROLE OPTIONS ===== */
const ROLE_OPTIONS = [
  { label: "Team Leader", role_id: 2 },
  { label: "Contributor", role_id: 3 }
];

const CreateProjectModal = ({
  open,
  onClose,
  deptId,
  teamId,
  onCreated
}) => {
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([{ user_id: "", role_id: "" }]);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  /* ================= FETCH USERS ================= */
 useEffect(() => {
  if (!open || !deptId || !teamId) return;

  axios.get(
    `http://127.0.0.1:8000/api/v1/department/${deptId}/team/${teamId}/members`,
    authHeader
  )
  .then(res => setUsers(res.data))
  .catch(err => {
    console.error("Failed to fetch users:", err.response?.data || err);
  });

}, [open, deptId, teamId]);

  /* ================= HELPERS ================= */
  const handleChange = (index, field, value) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const addRow = () => setAssignments([...assignments, { user_id: "", role_id: "" }]);
  const removeRow = (index) => setAssignments(assignments.filter((_, i) => i !== index));

  /* ================= CREATE PROJECT ================= */
  const handleCreate = async () => {
    try {
      if (!loggedInUser?.user_id) {
        alert("User not logged in");
        return;
      }

      if (!projectTitle.trim()) {
        alert("Project title required");
        return;
      }

      // 1️⃣ Create the project
      const projectRes = await axios.post(
        "http://127.0.0.1:8000/api/v1/project/",
        {
          team_id: Number(teamId),
          project_title: projectTitle,
          project_description: projectDescription || "",
          project_manager: loggedInUser.user_id,
          created_by: loggedInUser.user_id,
          status: "ACTIVE"
        },
        authHeader
      );

      const projectId = projectRes.data.project_id;
      let failedMembers = [];

      // 2️⃣ Assign members
      for (const a of assignments) {
        if (!a.user_id || !a.role_id) continue;

        try {
          await axios.post(
            `http://127.0.0.1:8000/api/v1/department/${deptId}/team/${teamId}/project/${projectId}/members/`,
            {
              project_id: projectId,
              user_id: Number(a.user_id),
              role_id: Number(a.role_id)
            },
            authHeader
          );
        } catch (err) {
          // Collect failed members for error reporting
          failedMembers.push({
            user_id: a.user_id,
            role_id: a.role_id,
            error: err.response?.data || err.message
          });
          console.error(`Failed to add user ${a.user_id}:`, err.response?.data || err);
        }
      }

      if (failedMembers.length > 0) {
        alert(
          `Project created, but some members could not be added:\n${failedMembers
            .map((f) => `User ID ${f.user_id}, Role ID ${f.role_id} -> ${f.error?.detail || f.error}`)
            .join("\n")}`
        );
      } else {
        alert("Project created successfully 🎉");
      }

      onCreated();
      onClose();

    } catch (err) {
      console.error("BACKEND ERROR 👉", err.response?.data || err);
      alert(`Project creation failed ❌\n${err.response?.data?.detail || err.message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create Project</DialogTitle>

      <DialogContent>
        {/* PROJECT TITLE */}
        <TextField
          label="Project Title"
          fullWidth
          margin="normal"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />

        {/* PROJECT DESCRIPTION */}
        <TextField
          label="Project Description"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />

        <Typography mt={3} mb={1} fontWeight={600}>
          Assign Members
        </Typography>

        {assignments.map((row, index) => (
          <Box key={index} display="flex" gap={2} mb={2}>
            {/* USER */}
            <TextField
              select
              label="User"
              fullWidth
              value={row.user_id}
              onChange={(e) => handleChange(index, "user_id", e.target.value)}
            >
              <MenuItem value="">Select user</MenuItem>
              {users.map((u) => (
                <MenuItem key={u.user_id} value={u.user_id}>
                  {u.user_name}
                </MenuItem>
              ))}
            </TextField>

            {/* ROLE */}
            <TextField
              select
              label="Role"
              fullWidth
              value={row.role_id}
              onChange={(e) => handleChange(index, "role_id", e.target.value)}
            >
              <MenuItem value="">Select role</MenuItem>
              {ROLE_OPTIONS.map((r) => (
                <MenuItem key={r.role_id} value={r.role_id}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>

            {assignments.length > 1 && (
              <IconButton onClick={() => removeRow(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}

        <Button startIcon={<AddIcon />} onClick={addRow}>
          Add Member
        </Button>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create Project
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
