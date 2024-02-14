import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { AuthContext } from "context/AuthContext";

const Logout = () => {
  const { setAuthState, authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  // const [cookies, , removeCookie] = useCookies(["__Host-access_token"]);

  useEffect(() => {
    const logout = async () => {
      // __Host-access_token 쿠키의 존재 여부로 로그인 상태 확인
      if (authState.status === "loggedOut") {
        console.log("로그인 상태가 아닙니다.");

        // 사용자를 로그인 페이지로 리다이렉트합니다.
        navigate("/login");
        return;
      }

      try {
        // 서버에 로그아웃 요청을 보냅니다.
        const response = await axios.post(
          `${API_URL}/logout`,
          {},
          {
            withCredentials: true,
          }
        );
        console.log("로그아웃 성공: ", response);
        setAuthState({ status: "loggedOut" });

        navigate("/");
      } catch (error) {
        console.error("에러 발생: ", error);
      }
    };

    logout();
  }, [navigate, authState.status]);

  return null; // 로그아웃 컴포넌트는 UI를 렌더링하지 않습니다.
};

export default Logout;
