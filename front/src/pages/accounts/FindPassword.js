import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const FindPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();
  
  const MainImg =
    "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FVjBRv%2FbtqHMwKxFgG%2FNPAxkGgvDkXeszqVT7MFm0%2Fimg.jpg";
  const API_URL = "http://127.0.0.1:8000";

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setError("");
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      verifyEmail();
    }
  };

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/verify_email`, { email });
      setUsername(response.data.username);
      setIsVerified(true);
      startTimer();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "이메일 주소 또는 이름이 일치하지 않습니다."
      );
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimeLeft(180);
    setTimer(
      setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000)
    );
  };

  const resetTimer = () => {
    clearInterval(timer);
    setTimer(null);
    setTimeLeft(null);
  };

  const verifyCode = async () => {
    try {
      await axios.post("/api/verify_code", { code: verificationCode });
      navigate.push("/change_password");
    } catch (err) {
      setError(err.response?.data?.message || "인증번호가 올바르지 않습니다.");
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      resetTimer();
      setIsVerified(false);
      setError("인증 시간이 만료되었습니다. 다시 시도해주세요.");
    }
  }, [timeLeft, timer]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <img className="absolute w-full h-full object-cover" src={MainImg} />
      <div className="relative p-8 bg-black bg-opacity-70 rounded shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          비밀번호 찾기
        </h2>
        <div className="flex flex-col space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="이름을 입력하세요."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white text-gray-700"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              placeholder="E-mail을 입력하세요."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white text-gray-700"
              required
            />
          </div>
          {!isVerified ? (
            <button
            onClick={verifyEmail}
            className={`w-full focus:outline-none text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-md px-5 py-2.5 mt-4 dark:focus:ring-yellow-900`}
          >
              인증번호 전송
            </button>
          ) : (
            <>
              <div className="flex justify-between mt-4">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="인증번호를 입력하세요."
                  className="w-4/5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white text-gray-700"
                  required
                />
                <button
                  onClick={verifyCode}
                  className={`w-1/5 py-2 ml-2
                   focus:outline-none text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-md dark:focus:ring-yellow-900`}
                >
                  확인
                </button>
              </div>
              <button
                onClick={verifyEmail}
                className={`w-full focus:outline-none text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-md px-5 py-2.5 mt-4 dark:focus:ring-yellow-900`}
              >
                인증번호 재전송
              </button>
            </>
          )}
          {error && <p className="text-yellow-500">{error}</p>}
          {timeLeft && (
            <div className="text-white mt-2">
              {Math.floor(timeLeft / 60)}:
              {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
            </div>
          )}
        </div>
        <div className="text-white text-center mt-4">
          <Link to="/login" className="text-sm hover:underline">
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindPassword;
