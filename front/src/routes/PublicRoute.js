import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = () => {
  const { authState } = useContext(AuthContext);

  return authState.status === "loggedOut" ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoute;
