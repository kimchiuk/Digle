import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
