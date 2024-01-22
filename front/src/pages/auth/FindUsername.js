import React, { useState } from "react";
import axios from "axios";
import FindPassword from "./FindPassword";

const FindUsername = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleEmailClick = () => {
    setEmail("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      findUsername();
    }
  };

  const findUsername = async () => {
    if (!email) {
      console.log("아이디를 찾겠소.");
      setError("이메일 주소를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      // axios를 사용하여 서버에 '아이디 찾기' 요청을 보냅니다.
      const response = await axios.post("/api/find-username", { email });
      setUsername(response.data.username); // 응답으로 받은 사용자 이름을 상태에 저장합니다.
    } catch (err) {
      // 에러 발생 시 메시지를 설정합니다.
      setError(
        err.response?.data?.message ||
          "잘못 입력하였거나 존재하지 않는 E-mail입니다."
      );
    } finally {
      setLoading(false); // 로딩 상태를 해제합니다.
      setEmail("");
      setUsername("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="flex flex-col items-center justify-center space-y-4 pt-20">
        <h2 className="text-xl font-bold mb-4">아이디 찾기</h2>
        <div className="flex flex-col items-center space-y-2">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            onClick={handleEmailClick}
            onKeyPress={handleKeyPress}
            placeholder="가입 시 사용한 이메일을 입력하세요"
            className="px-16 py-2 border rounded w-full "
          />
          <button
            onClick={findUsername}
            disabled={loading}
            className={`px-4 py-2 border rounded w-full max-w-xs ${
              loading ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            {loading ? "로딩 중..." : "아이디 찾기"}
          </button>
          {username && !error && (
            <p className="text-green-500">
              회원님의 아이디는 <strong>{username}</strong> 입니다.
            </p>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <FindPassword />
      </div>
    </div>
  );
};

export default FindUsername;
