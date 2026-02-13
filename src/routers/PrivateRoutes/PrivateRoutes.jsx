import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const PrivateRoutes = () => {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return null;
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};
