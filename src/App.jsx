import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import CrammingPage from "./pages/CrammingPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import ProblemGeneratePage from "./pages/ProblemGeneratePage";
import ProblemViewPage from "./pages/ProblemViewPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/header.css";
import "./styles/chat.css";
import "./styles/subject.css";
import "./styles/form.css";
import "./styles/profile.css";
import "./styles/task.css";
import "./styles/problem.css";
import "./styles/cramming.css";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="app-root">
          <Header />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cramming"
              element={
                <ProtectedRoute>
                  <CrammingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects/:subjectId"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/task/:subjectId/:taskId"
              element={
                <ProtectedRoute>
                  <TaskDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/problem/generate/:subjectId/:taskId"
              element={
                <ProtectedRoute>
                  <ProblemGeneratePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/problem/:problemId"
              element={
                <ProtectedRoute>
                  <ProblemViewPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}
