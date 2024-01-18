import React from "react";

const NaverLoginButton = () => {
  const handleNaverLogin = async () => {
    try {
      // 네이버 로그인 창을 열고 사용자 인증 요청
      const naverAuthUrl = "https://nid.naver.com/oauth2.0/authorize";
      const clientId = "3yosPikKiVLmBobZ44Ml";
      const redirectUri = "http://localhost:3000/naver_login/callback";
      const responseType = "token";

      window.location.href = `${naverAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}`;
    } catch (error) {
      console.error("Naver login error:", error);
    }
  };

  return (
    <div className="flex h-full items-center justify-center my-auto px-5 xl:mt-32 md:mt-48 mt-32 ">
      <div className="flex flex-col pt-40">
        <div className="text-3xl text-gray-800 font-bold my-auto">
          login하십쉬오
        </div>
        <div className="flex justify-center items-center h-20">
          <button onClick={handleNaverLogin}>Naver 로그인</button>
        </div>
      </div>
    </div>
  );
};

export default NaverLoginButton;

// export default NaverLoginComp;
