import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleNaverLogin } from "../api/authService";

const NaverLoginCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash.substr(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    console.log(token);
    if (token) {
      handleNaverLogin(token);
    }
  }, [location]);

  return <div>로그인 처리 중...</div>;
};

export default NaverLoginCallback;
