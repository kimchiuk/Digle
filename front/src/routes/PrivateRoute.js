import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const auth = useContext(AuthContext);

  if (auth.isLoggedIn) {
    alert("로그인이 필요합니다.");
  }
  return auth.isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
