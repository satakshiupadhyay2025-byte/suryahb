import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.id !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}
