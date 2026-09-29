import { useAuthStore } from '../hooks/userStorage';
import { Navigate } from 'react-router-dom';

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);

  if (!user || user.rol !== "Seller") {
    return <Navigate to="/login" replace />;
  }

  return children;
};
