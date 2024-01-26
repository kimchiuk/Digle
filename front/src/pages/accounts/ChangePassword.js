import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const MainImg =
  "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FVjBRv%2FbtqHMwKxFgG%2FNPAxkGgvDkXeszqVT7MFm0%2Fimg.jpg";
  const API_URL = "http://127.0.0.1:8000";

  const handleResetPassword = async () => {
    const formData = new FormData();
    formData.append('password', password)
    formData.append('confirm_password', confirmPassword)

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    try {
      // axios를 사용하여 서버에 '비밀번호 재설정' 요청을 보냅니다.
      await axios.post(`${API_URL}/change_password`, formData);
      alert("비밀번호가 성공적으로 변경되었습니다.");
      console.error("수정 성공!");
    } catch (err) {
      setError("비밀번호 변경에 실패하였습니다. 다시 시도해주세요.");
      console.error("씨바 에러 ㅈㄴ뜨네 ;;;");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <img className="absolute w-full h-full object-cover" src={MainImg} />
      <div className="relative p-8 bg-black bg-opacity-70 rounded shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-8">비밀번호 변경</h2>
        <div className="flex flex-col space-y-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white text-gray-700"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="새 
            비밀번호 확인"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white text-gray-700"
          />
          {error && <p className="text-yellow-500">{error}</p>}
          <button
            onClick={handleResetPassword}
            className="w-full focus:outline-none text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-md px-5 py-2.5 mt-2"
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
