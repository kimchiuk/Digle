import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleOauthLogin } from "../../api/authService";
import { AuthContext } from "context/AuthContext";

const LoginCallback = () => {
  const { setAuthState } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthentication = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const state = JSON.parse(decodeURIComponent(params.get("state")));
      const provider = state["provider"];
      const stateValue = state["stateValue"];
      if (code && state) {
        try {
          // 백엔드로 인증 코드 전송 및 처리
          await handleOauthLogin(provider, code, stateValue);
          navigate("/");
          setAuthState({ status: "loggedIn" });
        } catch (error) {
          console.error("Authentication error:", error);
          // 오류 처리 로직
        }
      }
    };
    handleAuthentication();
  }, [location]);

  return <div>로그인 처리 중...</div>;
};

export default LoginCallback;
