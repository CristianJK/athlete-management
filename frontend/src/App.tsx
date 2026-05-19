import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import CoachLayout from './layouts/CoachLayout';
import AthleteLayout from './layouts/AthleteLayout';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import AthletesPage from './features/athletes/AthletesPage';
import AthleteDetailPage from './features/athletes/AthleteDetailPage';
import AttendancePage from './features/attendance/AttendancePage';
import PaymentsPage from './features/payments/PaymentsPage';
import EventsPage from './features/events/EventsPage';
import NotificationsPage from './features/notifications/NotificationsPage';
import ReportsPage from './features/reports/ReportsPage';
import SettingsPage from './features/settings/SettingsPage';
import { Toaster } from 'react-hot-toast';

// --- WRAPPER DINÁMICO DE LAYOUT SEGÚN EL ROL DEL USUARIO ---
function DynamicLayout() {
  const { user } = useAuthStore();
  
  if (user?.role === 'admin') {
    return <AdminLayout />;
  }
  if (user?.role === 'coach') {
    return <CoachLayout />;
  }
  return <AthleteLayout />;
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          className: 'bg-slate-900 border border-slate-800 text-slate-100 text-xs font-bold rounded-xl px-4 py-3 shadow-2xl',
          duration: 3500
        }} 
      />
      <Routes>
        {/* Ruta Pública (Acceso directo si no está autenticado, sino redirige a dashboard) */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
        />

        {/* Todas las Rutas Protegidas (Anidadas bajo el Layout Dinámico según el Rol del usuario) */}
        <Route element={<ProtectedRoute><DynamicLayout /></ProtectedRoute>}>
          {/* Rutas compartidas por todos */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Rutas exclusivas para Administradores y Entrenadores */}
          <Route path="/athletes" element={<ProtectedRoute allowedRoles={['admin', 'coach']}><AthletesPage /></ProtectedRoute>} />
          <Route path="/athletes/:id" element={<ProtectedRoute allowedRoles={['admin', 'coach']}><AthleteDetailPage /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute allowedRoles={['admin', 'coach']}><AttendancePage /></ProtectedRoute>} />

          {/* Rutas exclusivas únicamente para Administradores */}
          <Route path="/payments" element={<ProtectedRoute allowedRoles={['admin']}><PaymentsPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin']}><SettingsPage /></ProtectedRoute>} />
        </Route>

        {/* Fallback de navegación */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}