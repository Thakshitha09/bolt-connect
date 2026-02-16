import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  AdminDashboard  from './components/AdminDashboard';
import { SearchPage } from './components/SearchPage';
import { LoginPage } from './components/LoginPage';
import  LogsPage  from './components/LogsPage'; // 👈 ADD THIS
import { useAuthStore } from './store/authStore';

export default function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>

        {/* Home */}
        <Route path="/" element={<SearchPage />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            user?.role === "ADMIN"
              ? <AdminDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* ✅ Logs Page Route */}
        <Route
          path="/logs"
          element={
            user?.role === "ADMIN"
              ? <LogsPage />
              : <Navigate to="/login" replace />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}
