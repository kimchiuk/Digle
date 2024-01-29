import { useContext, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const PrivateRoute = () => {
  const auth = useContext(AuthContext);
  const API_URL = "https://localhost:8000";

  useEffect(() => {
    const formData = new FormData();
    formData.append("token", "tokenValue");

    try {
      const response = axios.post(`${API_URL}/???`, formData);

      // 토큰이 유효할 시
      console.log(response);

      // 토큰이 유효하지 않을 시
      console.log();
    } catch (error) {
      console.error("에러내용 ", error);
    }
  }, []);

  if (auth.isLoggedIn) {
    alert("로그인이 필요합니다.");
  }
  return auth.isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
