import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NaverLoginButton from "../../components/NaverLoginButton";
import KakaoLoginButton from "../../components/KakaoLoginButton";
import GoogleLoginButton from "../../components/GoogleLoginButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const MainImg =
    "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FVjBRv%2FbtqHMwKxFgG%2FNPAxkGgvDkXeszqVT7MFm0%2Fimg.jpg";
  const API_URL = "https://localhost:8000";
  useEffect(() => {
    const handleStorageChange = () => {
      const rememberedEmail = localStorage.getItem("email");
      const rememberedRememberMe = localStorage.getItem("rememberMe");

      if (rememberedRememberMe) {
        setRememberMe(JSON.parse(rememberedRememberMe));
        if (JSON.parse(rememberedRememberMe)) {
          setEmail(rememberedEmail);
        } else {
          setEmail("");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Login button clicked!");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    if (rememberMe) {
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("email");
    }
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      console.log("로그인 성공: ", response);
    } catch (error) {
      console.error(
        "에라이 씨발 좀 되라고 개 씨발 좆같은거 에러 발생: ",
        error
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <img className="absolute w-full h-full object-cover " src={MainImg} />
      <div className="relative p-8 bg-black bg-opacity-70 rounded shadow-md max-w-sm w-full">
        <h3 className="text-3xl font-bold text-white text-center mb-8">
          로 그 인
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="아이디"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white text-gray-700"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white text-gray-700"
              required
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="rememberMe"
                onChange={(event) => setRememberMe(event.target.checked)}
                checked={rememberMe}
              />
              <label htmlFor="rememberMe" className="text-white ml-2">
                아이디 저장
              </label>
            </div>
          </div>
          <button className="w-full focus:outline-none text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">
            로그인
          </button>
          <div className="text-white text-center">
            <Link to="/signup" className="text-sm hover:underline">
              아이디가 없으신가요?
            </Link>
            <br />
            <Link
              to="/find_password"
              className="text-white text-sm hover:underline"
            >
              아이디 및 비밀번호 찾기
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <hr className="w-28 bg-white h-0.5 border-none" />
            <span className="text-white">OR</span>
            <hr className="w-28 bg-white h-0.5 border-none" />
          </div>
          <div className="flex justify-center space-x-10 bg-white mx-6 p-4 rounded-full">
            <GoogleLoginButton />
            <KakaoLoginButton />
            <NaverLoginButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
