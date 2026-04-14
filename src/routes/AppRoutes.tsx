import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Appointments from "../pages/Appointments";
import Patients from "../pages/Patients";
import Doctors from "../pages/Doctors";
import Drugs from "../pages/Drug";
import DrugImports from "../pages/DrugImport";
import Vouchers from "../pages/Vouchers";
import Orders from "../pages/Orders";
import Chat from "../pages/Chat";
import Quiz from "../pages/Quiz";
import CreateQuiz from "../pages/CreateQuiz";
import Settings from "../pages/Settings";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/appointments" element={
        <ProtectedRoute>
          <Appointments />
        </ProtectedRoute>
      } />

      <Route path="/patients" element={
        <ProtectedRoute>
          <Patients />
        </ProtectedRoute>
      } />

      <Route path="/doctors" element={
        <ProtectedRoute>
          <Doctors />
        </ProtectedRoute>
      } />

      <Route path="/drugs" element={
        <ProtectedRoute>
          <Drugs />
        </ProtectedRoute>
      } />

      <Route path="/drug-import" element={
        <ProtectedRoute>
          <DrugImports />
        </ProtectedRoute>
      } />

      <Route path="/vouchers" element={
        <ProtectedRoute>
          <Vouchers />
        </ProtectedRoute>
      } />

      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />

      <Route path="/chat" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />

      <Route path="/quiz" element={
        <ProtectedRoute>
          <Quiz />
        </ProtectedRoute>
      } />

      <Route path="/quiz/create" element={
        <ProtectedRoute>
          <CreateQuiz />
        </ProtectedRoute>
      } />

      <Route path="/quiz/edit/:testId" element={
        <ProtectedRoute>
          <CreateQuiz />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
