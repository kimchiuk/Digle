import axios from "axios";

// 아래와 같이 .env에 주소를 넣고 변경
// const API_BASE_URL = process.env.REACT_APP_API_URL;
// 개발환경에선 우선 localhost:8000 적용
const API_BASE_URL = "https://localhost:8000";

export const handleOauthLogin = async (provider, code) => {
  const formData = new FormData();
  formData.append("code", code);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/oauth_login/${provider}_login`,
      formData,
      {
        withCredentials: true,
      }
    );
    console.log(`${provider} Login Success:`, response);
    return response.data;
  } catch (error) {
    console.error(`Error during ${provider} Login:`, error);
    throw error;
  }
};
