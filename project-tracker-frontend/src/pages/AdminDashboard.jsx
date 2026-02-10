import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Snackbar,
  Divider,
  Stack
} from "@mui/material";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [notify, setNotify] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    job_profile: "",
    company_id: "",
    department_id: "",
    team_id: ""
  });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/v1/company/");
      setCompanies(res.data || []);
    } catch {
      setCompanies([]);
    }
  };

  const fetchDepartments = async (companyId) => {
    if (!companyId) return;
    const res = await api.get(`/api/v1/company/${companyId}/department`);
    setDepartments(res.data || []);
  };

  const fetchTeams = async (deptId) => {
    if (!deptId) return;
    const res = await api.get(`/api/v1/department/${deptId}/team`);
    setTeams(res.data || []);
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "company_id") {
      setDepartments([]);
      setTeams([]);
      setForm((prev) => ({
        ...prev,
        department_id: "",
        team_id: ""
      }));
      fetchDepartments(Number(value));
    }

    if (name === "department_id") {
      setTeams([]);
      setForm((prev) => ({ ...prev, team_id: "" }));
      fetchTeams(Number(value));
    }
  };

  /* ================= INVITE USER ================= */

  const inviteUser = async () => {
    try {
      setLoading(true);

      await api.post("/api/v1/admin/invite-user", {
        user_name: form.full_name,
        email_id: form.email,
        job_profile: form.job_profile,
        company_id: Number(form.company_id),
        department_id: Number(form.department_id),
        team_id: Number(form.team_id)
      });

      setNotify(true);
      resetForm();
    } catch (err) {
      alert("Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      full_name: "",
      email: "",
      job_profile: "",
      company_id: "",
      department_id: "",
      team_id: ""
    });
    setDepartments([]);
    setTeams([]);
  };

  const isFormValid =
    form.full_name &&
    form.email &&
    form.job_profile &&
    form.company_id &&
    form.department_id &&
    form.team_id;

  /* ================= UI ================= */

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600}>
        Admin Dashboard
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Invite users and manage organization structure
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3
        }}
      >
        {/* LEFT : INVITE USER */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Invite New User
            </Typography>

            <Stack spacing={2}>
              <Divider textAlign="left">Basic Info</Divider>

              <TextField
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
              />

              <Typography variant="caption" color="text.secondary">
                User will receive an email to set their password
              </Typography>

              <Divider textAlign="left">Role</Divider>

              <Select
                name="job_profile"
                value={form.job_profile}
                onChange={handleChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Select Job Profile
                </MenuItem>
                <MenuItem value="PROJECT_MANAGER">Project Manager</MenuItem>
                <MenuItem value="TEAM_LEADER">Team Leader</MenuItem>
                <MenuItem value="DEVELOPER">Developer</MenuItem>
                <MenuItem value="DESIGNER">Designer</MenuItem>
                <MenuItem value="QA">QA</MenuItem>
                <MenuItem value="TESTER">Tester</MenuItem>
              </Select>

              <Divider textAlign="left">Organization</Divider>

              <Select
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Select Company
                </MenuItem>
                {companies.map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.company_name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                displayEmpty
                disabled={!form.company_id}
                fullWidth
              >
                <MenuItem value="" disabled>
                  Select Department
                </MenuItem>
                {departments.map((d) => (
                  <MenuItem
                    key={d.department_id}
                    value={String(d.department_id)}
                  >
                    {d.department_name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                name="team_id"
                value={form.team_id}
                onChange={handleChange}
                displayEmpty
                disabled={!form.department_id}
                fullWidth
              >
                <MenuItem value="" disabled>
                  Select Team
                </MenuItem>
                {teams.map((t) => (
                  <MenuItem key={t.team_id} value={String(t.team_id)}>
                    {t.team_name}
                  </MenuItem>
                ))}
              </Select>

              <Button
                variant="contained"
                size="large"
                disabled={!isFormValid || loading}
                onClick={inviteUser}
                sx={{ mt: 2, borderRadius: 2 }}
              >
                {loading ? "Sending Invite..." : "Invite User"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* RIGHT : ADMIN INFO */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Admin Capabilities
            </Typography>

            <Typography variant="body2" color="text.secondary">
              • Invite users securely via email  
              • Assign roles, teams & departments  
              • Manage multi-company structure  
              • Control onboarding lifecycle  
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2">
              Coming next:
              <br />– User list & status  
              <br />– Resend / revoke invites  
              <br />– Role-based permissions  
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={notify}
        autoHideDuration={2500}
        onClose={() => setNotify(false)}
        message="Invite sent successfully ✔"
      />
    </Box>
  );
};

export default AdminDashboard;
