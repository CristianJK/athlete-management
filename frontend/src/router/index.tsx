import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import LoginPage from '@/pages/auth/LoginPage';

// Placeholders para páginas (se crearán en fases posteriores)
const Dashboard = () => <div className="p-8">Dashboard General</div>;
const AdminPanel = () => <div className="p-8">Panel de Administración</div>;
const Unauthorized = () => <div className="p-8">No tienes permiso para ver esta página</div>;

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        path: '/admin',
        element: <AdminPanel />,
      },
    ],
  },
]);
