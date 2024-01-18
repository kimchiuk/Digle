import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleKakaoLogin } from "../api/authService";

const KakaoLoginCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("code");
    console.log(token);
    if (token) {
      handleKakaoLogin(token);
    }
  }, [location]);

  return <div>로그인 처리 중...</div>;
};

export default KakaoLoginCallback;
