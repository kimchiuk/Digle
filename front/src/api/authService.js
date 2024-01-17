import axios from "axios";
const naverLogin = async (username, password) => {
  try {
    const response = await axios.post("/", {
      username,
      password,
    });
    console.log("로그인 성공:");
    return response;
  } catch (error) {
    console.log("에러 발생");
    throw error;
  }
};

export { naverLogin };
