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

interface PageShellProps {
  title: string;
}

// Shell genérico para páginas aún no implementadas
function PageShell({ title }: PageShellProps) {
  return (
    <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-4 animate-fadeIn">
      <h2 className="text-xl font-black text-slate-100">{title}</h2>
      <p className="text-slate-400 text-sm">
        Esta es la pantalla de prueba para <span className="font-bold text-blue-400">{title}</span>. 
        En las siguientes fases, reemplazaremos este contenido por interfaces y dashboards altamente detallados.
      </p>
      <div className="bg-slate-950 p-4 rounded-xl text-xs space-y-1 text-slate-500 border border-slate-900">
        <p>✓ Estado reactivo de Zustand: Cargado</p>
        <p>✓ Rutas anidadas y herencia de Layout: Activo</p>
      </div>
    </div>
  );
}

// Finanzas y Administración
function Reports() { return <PageShell title="Reportes y Estadísticas Consolidadas" />; }
function Settings() { return <PageShell title="Configuración del Club" />; }

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
          <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
        </Route>

        {/* Fallback de navegación */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}