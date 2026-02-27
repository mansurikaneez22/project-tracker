import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Departments from "./pages/Department";
import TeamList from "./pages/TeamList";
import TeamDetail from "./components/Teamdetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./components/ProjectDetail";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";
import SprintPage from "./pages/SprintPage";
import PMDashboard from "./pages/PMDashboard";
import TLDashboard from "./pages/TLDashboard";
import ContributorDashboard from "./pages/ContributorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Account from "./pages/Account";
import MyTasks from "./pages/MyTasks";
import PMTasks from "./pages/PMTasks";
import SetPassword from "./pages/SetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ContributorProjects from "./pages/ContributorProjects";

function App() {
  const currentUser = JSON.parse(localStorage.getItem("user")) || null;

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NotificationProvider currentUser={currentUser}>
          <BrowserRouter>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* PROTECTED ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={["PROJECT MANAGER","TEAM LEADER","CONTRIBUTOR","ADMIN"]} />}>
                <Route element={<MainLayout />}>
                  <Route path="/department" element={<Departments />} />
                  <Route path="/department/:deptId/team" element={<TeamList />} />
                  <Route path="/department/:deptId/team/:teamId" element={<TeamDetail />} />
                  <Route path="/department/:deptId/team/:teamId/project" element={<Projects />} />
                  <Route path="/department/:deptId/team/:teamId/project/:projectId" element={<ProjectDetail />} />
                  <Route path="/project/:projectId" element={<ProjectDetail />} />
                  <Route path="/department/:deptId/team/:teamId/project/:projectId/board/:sprintId" element={<SprintPage />} />
                  <Route path="/department/:deptId/team/:teamId/project/:projectId/task" element={<TaskList />} />
                  <Route path="/project/:projectId/task/:taskId" element={<TaskDetail />} />
                  <Route path="/my-tasks" element={<MyTasks />} />
                  <Route path="/pm/tasks" element={<PMTasks />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/pm/dashboard" element={<PMDashboard />} />
                  <Route path="/tl/dashboard" element={<TLDashboard />} />
                  <Route path="/contributor/dashboard" element={<ContributorDashboard />} />
                  <Route path="/contributor/projects" element={<ContributorProjects/>}/>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>
              </Route>

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;