import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import DepartmentList from "./components/DepartmentList";
import TeamList from "./pages/TeamList";
import TeamDetail from "./components/Teamdetail";

import Projects from "./pages/Projects";
import ProjectDetail from "./components/ProjectDetail";

import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import SetPassword from "./pages/SetPassword";
import ForgotPassword from "./pages/ForgotPassword";

import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";

import SprintBoard from "./pages/SprintBoard";

function App() {
  const userRole = localStorage.getItem("role");

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* ================= AUTH ================= */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* ================= REDIRECTS ================= */}
          <Route
            path="/departments"
            element={<Navigate to="/department" replace />}
          />

          {/* ================= DEPARTMENTS ================= */}
          <Route path="/department" element={<DepartmentList />} />
          <Route
            path="/department/:departmentId/team"
            element={<TeamList />}
          />

          {/* ================= TEAMS ================= */}
          <Route
            path="/department/:departmentId/team/:teamId"
            element={<TeamDetail />}
          />

          {/* ================= PROJECTS ================= */}
          <Route
            path="/department/:departmentId/team/:teamId/project"
            element={<Projects />}
          />

          <Route
            path="/department/:departmentId/team/:teamId/project/:projectId"
            element={<ProjectDetail />}
          />

          {/* direct project access */}
          <Route
            path="/project/:projectId"
            element={<ProjectDetail />}
          />

          {/* ================= BOARD / SPRINT (KANBAN) ================= */}
          {/* sprint = board → single source of truth */}
          <Route
            path="/project/:projectId/board/:boardId"
            element={<SprintBoard />}
          />

          {/* ================= TASKS ================= */}
          <Route
            path="/tasks"
            element={<TaskList userRole={userRole} />}
          />
         {/* <Route
            path="/task/:id"
            element={<TaskDetail />}
          />*/}
         <Route
  path="/department/:departmentId/team/:teamId/project/:projectId/task/:id"
  element={<TaskDetail />}
/>

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* ================= PASSWORD ================= */}
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
