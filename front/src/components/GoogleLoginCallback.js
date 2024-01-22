import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleGoogleLogin } from "../api/authService";

const GoogleLoginCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("code");
    console.log(token);
    if (token) {
      handleGoogleLogin(token);
    }
  }, [location]);

  return <div>로그인 처리 중...</div>
}

export default GoogleLoginCallback;