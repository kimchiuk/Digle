import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = () => {
  const { AuthProvider } = useContext(AuthContext);

  return AuthProvider.isLoggedIn ? <Navigate to="/login" /> : <Outlet />;
};

export default PublicRoute;
