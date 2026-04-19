import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import HomePage from "@/features/traveler/pages/HomePage";
import DestinationsListPage from "@/features/traveler/pages/DestinationsListPage";
import DestinationDetailPage from "@/features/traveler/pages/DestinationDetailPage";
import PackagesListPage from "@/features/traveler/pages/PackagesListPage";
import PackageDetailPage from "@/features/traveler/pages/PackageDetailPage";
import BookingFormPage from "@/features/traveler/pages/BookingFormPage";
import BookingConfirmationPage from "@/features/traveler/pages/BookingConfirmationPage";
import UserDashboardPage from "@/features/traveler/pages/UserDashboardPage";
import ItineraryPlannerPage from "@/features/traveler/pages/ItineraryPlannerPage";
import AdminPage from "@/features/admin/pages/AdminPage";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token) return <Navigate to="/login?role=user" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/home" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User — protected */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/destinations" element={<ProtectedRoute><DestinationsListPage /></ProtectedRoute>} />
        <Route path="/destinations/:id" element={<ProtectedRoute><DestinationDetailPage /></ProtectedRoute>} />
        <Route path="/packages" element={<ProtectedRoute><PackagesListPage /></ProtectedRoute>} />
        <Route path="/packages/:id" element={<ProtectedRoute><PackageDetailPage /></ProtectedRoute>} />
        <Route path="/book/:packageId" element={<ProtectedRoute><BookingFormPage /></ProtectedRoute>} />
        <Route path="/booking/confirmation" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
        <Route path="/planner" element={<ProtectedRoute><ItineraryPlannerPage /></ProtectedRoute>} />

        {/* Admin — protected + adminOnly */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;