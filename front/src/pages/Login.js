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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div
        className="px-8 py-6 mt-4 text-left bg-white shadow"
        style={{ aspectRatio: "1.5 / 1" }}
      >
        <h3 className="text-2xl font-bold text-center">로그인</h3>
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
            </div>
            <Link
              to="/signup"
              className="text-sm text-blue-600 hover:underline"
            >
              아이디가 없으신가요?
            </Link>
            <div>
              {/* 일단 대충 넣음 */}
              <span>구글</span> | <span>네이버</span> | <span>카카오</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
