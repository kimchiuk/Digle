import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Navigate, useNavigate } from "react-router-dom";
import { handleGoogleLogin } from "../api/authService";

const GoogleLoginComp = () => {
  // Google Client ID
  //   const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_ID =
    "157866739251-rq4urc1dmtvhhho8rammdevidspi0g2t.apps.googleusercontent.com";
  //   const { authState } = useAuth();
  //   const { authState, updateAuthState } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = async (googleData) => {
    try {
      const response = await handleGoogleLogin(googleData);
      console.log(response);
      // AuthState, 즉 로그인 되어 있는지 저장해둠. 테스트 후 적용
      //   updateAuthState({
      //     ...authState,
      //     isLoggedIn: true,
      //   });

      // 추가정보 입력 routing 함수. 임시 주석처리.
      // if (response.message === "New User") navigate("/regist");
      // else if (response.message === "Additional Info Required") navigate("/regist");
      // else if (response.message === "login complete") navigate("/home");
      // else throw new expect();
      //   navigate(getLangUrl("/home"));
    } catch (error) {
      console.log("Login Error Server response:", error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Google Login Failure:", error);
  };

  return (
    <div className="flex h-full items-center justify-center my-auto px-5 xl:mt-32">
      <div className="flex flex-col pt-40">
        <div className="text-3xl text-gray-800 font-bold my-auto">
          login하십쉬오
        </div>
        <div className="flex justify-center items-center h-20">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              buttonText="Login"
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
              cookiePolicy={"single_host_origin"}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default GoogleLoginComp;
