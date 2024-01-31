import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { AuthProvider } = useContext(AuthContext);

  return AuthProvider.isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
