import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import DepartmentList from "./components/DepartmentList";
import TeamList from "./pages/TeamList";
import TeamDetail from "./components/Teamdetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./components/ProjectDetail";

import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";
import SprintBoard from "./pages/SprintBoard";

import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PMDashboard from "./pages/PMDashboard";
import SetPassword from "./pages/SetPassword";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ================= PROTECTED ROUTES ================= */}
          <Route element={<ProtectedRoute />}>
            <Route path="/department" element={<DepartmentList />} />
             
            <Route path="/department/:deptId/team" element={<TeamList />} />

<Route
  path="/department/:deptId/team/:teamId"
  element={<TeamDetail />}
/>

<Route
  path="/department/:deptId/team/:teamId/project"
  element={<Projects />}
/>

<Route
  path="/department/:deptId/team/:teamId/project/:projectId"
  element={<ProjectDetail />}
/>

<Route
  path="/department/:deptId/team/:teamId/project/:projectId/board/:boardId"
  element={<SprintBoard />}
/>

<Route
  path="/department/:deptId/team/:teamId/project/:projectId/task"
  element={<TaskList />}
/>

<Route
  path="/project/:projectId/task/:taskId"
  element={<TaskDetail />}
/>

          </Route>

          {/* ================= ADMIN ROUTES ================= */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminRoute />}>
              <Route
                path="/admin-dashboard"
                element={<AdminDashboard />}
              />
            </Route>
          </Route>
           

       <Route element={<ProtectedRoute />}>
  <Route path="/pm/dashboard" element={<PMDashboard />} />
</Route>


          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/department" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
