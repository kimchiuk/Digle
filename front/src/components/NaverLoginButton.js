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

  return <button onClick={handleNaverLogin}>
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSToC3NbDmPm1lD80WzxcJX8lMLKgvOkBFIv-isoFYKbU-J1XYl"
      width="35"
      alt="네이버 로그인 버튼"
    />
  </button>
};

export default NaverLoginButton;

// export default NaverLoginComp;
