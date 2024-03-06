import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../providers/AuthContext";

export const PublicRoutes = () => {
  const { user } = useContext(AuthContext);

  return user ? <Navigate to="/user" /> : <Outlet />;
};


