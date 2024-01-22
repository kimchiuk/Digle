import React from "react";

const KakaoLoginButton = () => {
  const KAKAO_CLIENT_ID = "8d3911fd405c36bc63a98885dc47ef92";
  const REDIRECT_URI = "http://localhost:3000/kakao_login/callback";

  const handleKakaoLogin = async () => {
    try {
      const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
      window.location.href = kakaoURL;
    } catch (error) {
      console.error("Kakao Login Failure:", error);
    }
  };

  return <button onClick={handleKakaoLogin}>
          <img
            src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcThWWH5fUeVik-2tyKkIxp0LPhJEdO4HTLYLYMsYhits4sQOUc0"
            width="35"
            alt="카카오 로그인 버튼"
          />
        </button>
};

export default KakaoLoginButton;
