import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const Logout = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  // 두 번째 콤마는 setCookie 함수를 건너뛰기 위한 것(구조 분해 할당)
  const [cookies, setCookie, removeCookie] = useCookies(["isLogin"]);

  useEffect(() => {
    const logout = async () => {
      // 로그인 상태 확인
      if (!cookies.isLogin) {
        console.log("로그인 상태가 아닙니다.");

        // 사용자를 로그인 페이지로 리다이렉트합니다.
        navigate("/login");
        return;
      }

      try {
        // 서버에 로그아웃 요청을 보냅니다.
        const response = await axios.post(`${API_URL}/logout`, {
          withCredentials: true,
        });
        console.log("로그아웃 성공: ", response);

        // 로그아웃이 성공하면 쿠키에서 사용자 정보를 지웁니다.
        removeCookie("isLogin", { path: "/", domain: "localhost" });
        navigate("/");
      } catch (error) {
        console.error("에러 발생: ", error);
      }
    };

    logout();
  }, [navigate, removeCookie, cookies.isLogin]);
};

export default Logout;
