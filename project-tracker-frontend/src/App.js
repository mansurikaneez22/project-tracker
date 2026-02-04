import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext"; // <-- import theme context
import Navbar from "./components/Navbar"; // <-- add a navbar with toggle

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
import SprintBoard from "./pages/SprintBoardPage";

function App() {
  const userRole = localStorage.getItem("role"); // "PM", "TL", "Member"

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar /> {/* Always visible, has toggle button */}
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect OLD plural route */}
          <Route path="/departments" element={<Navigate to="/department" replace />} />

          {/* Departments */}
          <Route path="/department" element={<DepartmentList />} />

          {/* Teams */}
          <Route path="/department/:departmentId/team" element={<TeamList />} />

          {/* Projects */}
          <Route path="/department/:departmentId/team/:teamId/project" element={<Projects />} />
          <Route path="/department/:departmentId/team/:teamId/project/:projectId" element={<ProjectDetail />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />

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

          {/* BOARD TASKS */}
          <Route path="/project/:projectId/board/:boardId" element={<BoardTaskList />} />
          <Route path="/board-tasks" element={<BoardTaskPage />} />

          {/* Teams detail */}
          <Route path="/department/:departmentId/team/:teamId" element={<TeamDetail />} />

          {/* Projects & tasks */}
          <Route path="/department/:departmentId/team/:teamId/project" element={<Projects />} />
          <Route path="/department/:departmentId/team/:teamId/project/:projectId/tasks" element={<TaskList />} />
          
          <Route path="/board/:boardId" element={<SprintBoard />}
/>

        
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
