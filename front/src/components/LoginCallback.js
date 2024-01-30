import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleOauthLogin } from "../api/authService";

const LoginCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    console.log(params.get("state"));
    const provider = JSON.parse(decodeURIComponent(params.get("state")))[
      "provider"
    ];
    if (code) {
      handleOauthLogin(provider, code);
    }
  }, [location]);

  return <div>로그인 처리 중...</div>;
};

export default LoginCallback;
