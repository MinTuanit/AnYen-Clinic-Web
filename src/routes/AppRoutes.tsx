import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Appointment from "../pages/Appointment";
import Patients from "../pages/Patients";
import Doctors from "../pages/Doctors";
import Medicines from "../pages/Medicines";
import Vouchers from "../pages/Vouchers";
import Chat from "../pages/Chat";
import Quiz from "../pages/Quiz";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/appointments" element={<Appointment />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/medicines" element={<Medicines />} />
      <Route path="/vouchers" element={<Vouchers />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
