import React from "react";
import { getSessionState } from "../../api/authService";

const NaverLoginButton = () => {
  const handleNaverLogin = async () => {
    try {
      const stateValue = await getSessionState();
      // 네이버 로그인 창을 열고 사용자 인증 요청
      const clientId = "3yosPikKiVLmBobZ44Ml";
      const redirectUri = encodeURIComponent(
        `${window.location.origin}/login/callback`
      );
      const naverAuthUrl = "https://nid.naver.com/oauth2.0/authorize";
      const responseType = "code";
      const state = encodeURIComponent(
        JSON.stringify({ provider: "naver", stateValue: stateValue })
      );

      window.location.href = `${naverAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&state=${encodeURIComponent(
        state
      )}`;
    } catch (error) {
      console.error("Naver login error:", error);
    }
  };

  return (
    <button onClick={handleNaverLogin}>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSToC3NbDmPm1lD80WzxcJX8lMLKgvOkBFIv-isoFYKbU-J1XYl"
        width="35"
        alt="네이버 로그인 버튼"
      />
    </button>
  );
};

export default NaverLoginButton;

// export default NaverLoginComp;
