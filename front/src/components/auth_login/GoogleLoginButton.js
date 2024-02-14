import { AuthContext } from "context/AuthContext";
import { getSessionState } from "api/authService";
import React, { useContext } from "react";

const GoogleLoginButton = () => {
  const { setAuthState } = useContext(AuthContext);

  const GOOGLE_CLIENT_ID =
    "157866739251-rq4urc1dmtvhhho8rammdevidspi0g2t.apps.googleusercontent.com";

  const handleGoogleLogin = async () => {
    try {
      const stateValue = await getSessionState();
      const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
      const responseType = "code";
      const redirectUri = encodeURIComponent(
        `${window.location.origin}/login/callback`
      );
      const scope = encodeURIComponent(
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
      );
      const state = encodeURIComponent(
        JSON.stringify({ provider: "google", stateValue: stateValue })
      );
      const googleURL = `${googleAuthUrl}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${encodeURIComponent(
        state
      )}`;

      window.location.href = googleURL;
      setAuthState({ status: "loggedIn" });
    } catch (error) {
      console.error("워닝! 워닝! 에러발생!");
    }
  };

  return (
    <button onClick={handleGoogleLogin}>
      <img
        src="https://imgnews.pstatic.net/image/016/2015/09/03/20150903000132_0_99_20150903075103.jpg?type=w647"
        width="45"
        alt="구글 로그인 버튼"
      />
    </button>
  );
};

export default GoogleLoginButton;
