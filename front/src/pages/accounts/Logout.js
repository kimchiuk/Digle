import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const Logout = () => {
  const navigate = useNavigate();
  const API_URL = "https://localhost:8000";
  const [cookies, , removeCookie] = useCookies(["rememberUserId"]);

  useEffect(() => {
    const logout = async () => {
      try {
        // 서버에 로그아웃 요청을 보냅니다.
        const response = await axios.post(`${API_URL}/logout`);
        console.log("로그아웃 성공: ", response);

        // 로그아웃이 성공하면 쿠키에서 사용자 정보를 지웁니다.
        removeCookie("rememberUserId");

        // 사용자를 로그인 페이지로 리다이렉트합니다.
        navigate("/login");
      } catch (error) {
        console.error("에러 발생: ", error);
      }
    };

    logout();
  }, [navigate, removeCookie]);

};

export default Logout;
