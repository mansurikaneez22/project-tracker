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

  //  NEW STATES
  const [users, setUsers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pending: 0
  });
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    job_profile: "",
    company_id: "",
    department_id: "",
    team_id: ""
  });

  /*LOAD DATA */

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
    fetchInvites();
    fetchStats();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/v1/company/");
      setCompanies(res.data || []);
    } catch {
      setCompanies([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/v1/admin/users");
      setUsers(res.data || []);
    } catch {
      setUsers([]);
    }
  };

  const fetchInvites = async () => {
    try {
      const res = await api.get("/api/v1/admin/invites");
      setInvites(res.data || []);
    } catch {
      setInvites([]);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/v1/admin/stats");
      setStats(res.data);
    } catch {
      setStats({ totalUsers: 0, activeUsers: 0, pending: 0 });
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

  /* HANDLE CHANGE */

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

  /* INVITE USER*/

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

      fetchUsers();
      fetchInvites();
      fetchStats();
    } catch (err) {
      alert("Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    await api.delete(`/api/v1/admin/users/${id}`);
    fetchUsers();
    fetchStats();
  };

  const resendInvite = async (id) => {
    await api.post(`/api/v1/admin/resend-invite/${id}`);
    alert("Invite resent");
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

  
  const filteredUsers = users.filter((u) => {
  const name = u.user_name || u.name || "";
  const email = u.email_id || u.email || "";

  return `${name} ${email}`
    .toLowerCase()
    .includes(search.toLowerCase());
});

console.log(users)
  /* UI */

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600}>
        Admin Dashboard
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Invite users and manage organization structure
      </Typography>

      {/* STATS */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
        <Card><CardContent>
          <Typography>Total Users</Typography>
          <Typography variant="h5">{stats.totalUsers}</Typography>
        </CardContent></Card>

        <Card><CardContent>
          <Typography>Active Users</Typography>
          <Typography variant="h5">{stats.activeUsers}</Typography>
        </CardContent></Card>

        <Card><CardContent>
          <Typography>Pending</Typography>
          <Typography variant="h5">{stats.pending}</Typography>
        </CardContent></Card>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 3 }}>
        
        {/* INVITE FORM */}
        <Card>
          <CardContent>
            <Typography variant="h6">Invite New User</Typography>

            <Stack spacing={2}>
              <TextField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} />
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} />

              <Select name="job_profile" value={form.job_profile} onChange={handleChange} displayEmpty>
                <MenuItem value="" disabled>Select Role</MenuItem>
                <MenuItem value="PROJECT_MANAGER">Project Manager</MenuItem>
                <MenuItem value="TEAM_LEADER">Team Leader</MenuItem>
                <MenuItem value="CONTRIBUTOR">Contributor</MenuItem>
              </Select>

              <Select name="company_id" value={form.company_id} onChange={handleChange} displayEmpty>
                <MenuItem value="" disabled>Select Company</MenuItem>
                {companies.map(c => (
                  <MenuItem key={c.id} value={String(c.id)}>{c.company_name}</MenuItem>
                ))}
              </Select>

              <Select name="department_id" value={form.department_id} onChange={handleChange} displayEmpty disabled={!form.company_id}>
                <MenuItem value="" disabled>Select Department</MenuItem>
                {departments.map(d => (
                  <MenuItem key={d.department_id} value={String(d.department_id)}>{d.department_name}</MenuItem>
                ))}
              </Select>

              <Select name="team_id" value={form.team_id} onChange={handleChange} displayEmpty disabled={!form.department_id}>
                <MenuItem value="" disabled>Select Team</MenuItem>
                {teams.map(t => (
                  <MenuItem key={t.team_id} value={String(t.team_id)}>{t.team_name}</MenuItem>
                ))}
              </Select>

              <Button disabled={!isFormValid || loading} onClick={inviteUser}>
                {loading ? "Sending..." : "Invite User"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card
  sx={{
    borderRadius: 3,
    transition: "0.3s",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: 6
    }
  }}
>
  <CardContent>
    <Typography variant="h6" mb={2}>
      Admin Info
    </Typography>

    <Stack spacing={2} alignItems="center">
      
      {/* Avatar */}
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#1976d2",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 600
        }}
      >
        A
      </Box>

      {/* Name */}
      <Typography fontWeight={600}>
        {users[0]?.name || users[0]?.user_name || "Admin"}
      </Typography>

      {/* Email */}
      <Typography variant="body2" color="text.secondary">
        {users[0]?.email || users[0]?.email_id || "admin@email.com"}
      </Typography>

      <Divider sx={{ width: "100%" }} />

      {/* Role */}
      <Typography
  sx={(theme) => ({
    background: theme.palette.primary.main + "20", // light tint
    color: theme.palette.primary.main,
    px: 1.5,
    py: 0.5,
    borderRadius: 2,
    fontSize: 12,
    fontWeight: 600
  })}
>
  {users[0]?.role || "ADMIN"}
</Typography>

      <Typography variant="caption" color="text.secondary">
        Manage users, teams & permissions
      </Typography>

    </Stack>
  </CardContent>
</Card>
</Box> 

      {/* USERS */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6">Users</Typography>

          <TextField
            fullWidth
            placeholder="Search users..."
            sx={{ my: 2 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          
          {filteredUsers.map((u) => {
  const name = u.name || u.user_name || "No Name";
  const email = u.email || u.email_id || "No Email";

  return (
    <Box
      key={u.id}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        p: 1,
        borderBottom: "1px solid #eee"
      }}
    >
      <span>{name} ({email})</span>

      <Button color="error" onClick={() => deleteUser(u.id)}>
        Delete
      </Button>
    </Box>
  );
})}
        </CardContent>
      </Card>

      {/* INVITES */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Pending Invites</Typography>

          {invites.map((i) => (
            <Box key={i.id} sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
              <span>{i.email_id || i.email}</span>
              <Button onClick={() => resendInvite(i.id)}>Resend</Button>
            </Box>
          ))}
        </CardContent>
      </Card>

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