import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
  // 1번쨰 div Class
  // flex items-center justify-center h-screen bg-gray-100
  return (
    <div className="relative">
      <img className="w-full h-[800px] object-cover" src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FVjBRv%2FbtqHMwKxFgG%2FNPAxkGgvDkXeszqVT7MFm0%2Fimg.jpg" />
      <form 
        className="absolute text-left top-0 left-0 right-0 bottom-0 p-36"
      >
        <h3 className="text-2xl font-bold text-white text-center">로그인</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <input
                type="text"
                placeholder="ID"
                id="username"
                onChange={(event) => setUsername(event.target.value)}
                value={username}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mt-4">
              <input
                type="password"
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button className="w-full px-6 py-2 mt-4 text-white bg-black rounded-lg hover:bg-blue-900">
                로그인
              </button>
            </div><br />
            <div className="text-white">
            <Link
              to="/signup"
              className="text-sm hover:underline"
            >
              <p>아이디가 없으신가요?</p>
            </Link>
              {/* 일단 대충 넣음 */}
              <span>
                <Link to="/google_login">
                  GoogleImg
                </Link>
              </span> | <span>네이버</span> | <span>카카오</span>
            </div>
          </div>
        </form>
      </form>
    </div>
  );
};

export default Login;
