import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "./components/LoginPage";
import { SearchPage } from "./components/SearchPage";
import { AdminDashboard } from "./components/AdminDashboard";
import  LogsPage  from "./components/LogsPage";

import { useAuthStore } from "./store/authStore";

export default function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            user?.role === "ADMIN" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ✅ LOGS ROUTE */}
        <Route
          path="/logs"
          element={
            user?.role === "ADMIN" ? (
              <LogsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
