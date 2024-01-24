import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NaverLoginButton from "../../components/NaverLoginButton";
import KakaoLoginButton from "../../components/KakaoLoginButton";
import GoogleLoginButton from "../../components/GoogleLoginButton";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const MainImg =
    "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FVjBRv%2FbtqHMwKxFgG%2FNPAxkGgvDkXeszqVT7MFm0%2Fimg.jpg";
  const API_URL = 'http://127.0.0.1:8000'
  useEffect(() => {
    const handleStorageChange = () => {
      const rememberedUsername = localStorage.getItem("username");
      const rememberedRememberMe = localStorage.getItem("rememberMe");

      if (rememberedRememberMe) {
        setRememberMe(JSON.parse(rememberedRememberMe));
        if (JSON.parse(rememberedRememberMe)) {
          setUsername(rememberedUsername);
        } else {
          setUsername("");
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

    if (rememberMe) {
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("username");
    }
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      console.log("로그인 성공:");
    } catch (error) {
      console.log("에러 발생");
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
              id="username"
              onChange={(event) => setUsername(event.target.value)}
              value={username}
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
