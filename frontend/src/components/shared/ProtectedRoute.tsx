import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // Si no está autenticado, redirige a la pantalla de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no tiene el rol permitido, redirige al dashboard general
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // De lo contrario, renderiza el componente hijo
  return <>{children}</>;
}
