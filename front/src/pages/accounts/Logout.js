import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const Logout = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const [cookies, , removeCookie] = useCookies(["__Host-access_token"]);

  useEffect(() => {
    const logout = async () => {
      // __Host-access_token 쿠키의 존재 여부로 로그인 상태 확인
      if (!cookies['__Host-access_token']) {
        console.log("로그인 상태가 아닙니다.");

        // 사용자를 로그인 페이지로 리다이렉트합니다.
        navigate("/login");
        return;
      }

      try {
        // 서버에 로그아웃 요청을 보냅니다.
        const response = await axios.post(`${API_URL}/logout`, {}, {
          withCredentials: true,
        });
        console.log("로그아웃 성공: ", response);

        // 로그아웃이 성공하면 쿠키에서 토큰을 지웁니다.
        removeCookie("__Host-access_token", { path: "/" }); // 필요한 경우 domain 설정 추가
        navigate("/");
      } catch (error) {
        console.error("에러 발생: ", error);
      }
    };

    logout();
  }, [navigate, removeCookie, cookies['__Host-access_token']]);

  return null; // 로그아웃 컴포넌트는 UI를 렌더링하지 않습니다.
};

export default Logout;
