import React from "react";
import { getSessionState } from "../../api/authService";

const KakaoLoginButton = () => {
  const KAKAO_CLIENT_ID = "8d3911fd405c36bc63a98885dc47ef92";
  const redirectUri = encodeURIComponent(
    `${window.location.origin}/login/callback`
  );

  const handleKakaoLogin = async () => {
    try {
      const stateValue = await getSessionState();
      const state = encodeURIComponent(
        JSON.stringify({ provider: "kakao", stateValue: stateValue })
      );
      const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
      window.location.href = kakaoURL;
    } catch (error) {
      console.error("Kakao Login Failure:", error);
    }
  };

  return (
    <button onClick={handleKakaoLogin}>
      <img
        src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcThWWH5fUeVik-2tyKkIxp0LPhJEdO4HTLYLYMsYhits4sQOUc0"
        width="35"
        alt="카카오 로그인 버튼"
      />
    </button>
  );
};

export default KakaoLoginButton;
