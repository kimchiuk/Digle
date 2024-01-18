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

  return (
    <div className="flex h-full items-center justify-center my-auto px-5 xl:mt-32 md:mt-48 mt-32">
      <div className="flex flex-col pt-40">
        <div className="text-3xl text-gray-800 font-bold my-auto">
          Kakao 로그인
        </div>
        <div className="flex justify-center items-center h-20">
          <button onClick={handleKakaoLogin}>
            <img
              src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
              width="222"
              alt="카카오 로그인 버튼"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KakaoLoginButton;
