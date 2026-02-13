import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const PublicRoutes = () => {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return null;
  }

  return user ? <Navigate to="/user" replace /> : <Outlet />;
};


