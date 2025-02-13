import axios from "axios";

// 아래와 같이 .env에 주소를 넣고 변경
// const API_BASE_URL = process.env.REACT_APP_API_URL;
// 개발환경에선 우선 localhost:8000 적용
const API_BASE_URL = "http://localhost:8000";

export const handleGoogleLogin = async (googleData) => {
  const formData = new FormData();
  formData.append("token", googleData.credential);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/login/google_login`,
      formData,
      {
        withCredentials: true,
      }
    );
    console.log("Google Login Success:", response);
    return response.data;
  } catch (error) {
    console.error("Error during Google Login:", error);
    throw error;
  }
};

export const handleNaverLogin = async (code) => {
  const formData = new FormData();
  formData.append("token", code);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/login/naver_login`,
      formData,
      {
        withCredentials: true,
      }
    );
    console.log("Naver Login Success:", response);
    return response.data;
  } catch (error) {
    console.error("Error during Naver Login:", error);
    throw error;
  }
};

export const handleKakaoLogin = async (code) => {
  const formData = new FormData();
  formData.append("code", code);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/login/kakao_login`,
      formData,
      {
        withCredentials: true,
      }
    );
    console.log("Naver Login Success:", response);
    return response.data;
  } catch (error) {
    console.error("Error during Naver Login:", error);
    throw error;
  }
};
