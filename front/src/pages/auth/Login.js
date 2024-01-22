import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NaverLoginButton from "../../components/NaverLoginButton";
import KakaoLoginButton from "../../components/KakaoLoginButton";
import GoogleLoginButton from "../../components/GoogleLoginButton";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const MainImg =
    "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FVjBRv%2FbtqHMwKxFgG%2FNPAxkGgvDkXeszqVT7MFm0%2Fimg.jpg";

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Login button clicked!");

    try {
      const response = await axios.post("/", {
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
      <img className="absolute w-full h-full object-cover" src={MainImg} />
      <div className="relative p-8 bg-black bg-opacity-70 rounded shadow-md max-w-sm w-full">
        <h3 className="text-3xl font-bold text-white text-center mb-8">
          로 그 인
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="ID"
              id="username"
              onChange={(event) => setUsername(event.target.value)}
              value={username}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-700"
              required
            />
          </div>
          <button className="w-full text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-md text-sm px-5 py-2.5 text-center me-2 mb-2">
            로그인
          </button>
          <div className="text-white text-center">
            <Link to="/signup" className="text-sm hover:underline">
              아이디가 없으신가요?
            </Link>
            <Link to="/find_username" className="text-sm hover:underline">
              아이디 찾기
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
