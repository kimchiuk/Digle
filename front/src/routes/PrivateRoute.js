import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return !isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
