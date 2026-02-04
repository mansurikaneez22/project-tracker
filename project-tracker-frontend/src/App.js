import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import DepartmentList from "./components/DepartmentList";
import TeamList from "./pages/TeamList";
import Projects from "./pages/Projects";
import ProjectDetail from "./components/ProjectDetail";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import SetPassword from "./pages/SetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";
import BoardTaskList from "./components/BoardTaskList";
import BoardTaskPage from "./pages/BoardTaskPage";
import TeamDetail from "./components/Teamdetail";
import SprintBoard from "./pages/SprintBoard";

function App() {
  const userRole = localStorage.getItem("role");

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect */}
          <Route
            path="/departments"
            element={<Navigate to="/department" replace />}
          />

          {/* Departments */}
          <Route path="/department" element={<DepartmentList />} />
          <Route
            path="/department/:departmentId/team"
            element={<TeamList />}
          />

          {/* Teams */}
          <Route
            path="/department/:departmentId/team/:teamId"
            element={<TeamDetail />}
          />

          {/* Projects */}
          <Route
            path="/department/:departmentId/team/:teamId/project"
            element={<Projects />}
          />
          <Route
            path="/department/:departmentId/team/:teamId/project/:projectId"
            element={<ProjectDetail />}
          />
          <Route
            path="/project/:projectId"
            element={<ProjectDetail />}
          />

          {/* Admin */}
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

          {/* Password */}
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Tasks */}
          <Route path="/tasks" element={<TaskList userRole={userRole} />} />
          <Route path="/task/:id" element={<TaskDetail />} />

          {/* OLD board task list (LIST view) */}
          <Route
            path="/project/:projectId/board/:boardId"
            element={<BoardTaskList />}
          />

          <Route path="/board-tasks" element={<BoardTaskPage />} />

          {/* ✅ SPRINT BOARD (KANBAN) */}
          <Route
            path="/project/:projectId/sprint/:sprintId"
            element={<SprintBoard />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
