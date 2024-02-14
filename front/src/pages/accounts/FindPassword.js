import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MainImg from "../../assets/main.png";
import { useCookies } from "react-cookie";

const FindPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["email"]); // Coockies 이름임

  const API_URL = process.env.REACT_APP_API_BASE_URL;

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
    const formData = new FormData();
    formData.append("name", username);
    formData.append("email", email);

    try {
      const response = await axios.post(`${API_URL}/find_password`, formData);
      setIsVerified(true);
      startTimer();
      console.log(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "이메일 주소 또는 이름이 일치하지 않습니다."
      );
      setIsVerified(false);
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

  const onClickErrorCode = () => {
    setError("");
  };

  const resetTimer = () => {
    clearInterval(timer);
    setTimer(null);
    setTimeLeft(null);
  };

  const verifyCode = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("auth_code", verificationCode);
    try {
      await axios.post(`${API_URL}/verify_password_reset`, formData);
      setCookie("email", email);
      navigate(`/reset_password`);
      console.log("인증이 확인 되었습니다!");
    } catch (err) {
      setError(err.response?.data?.message || "인증번호가 올바르지 않습니다.");
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      resetTimer();
      setIsVerified(false);
      setError("");
      alert("인증 시간이 만료되었습니다. 다시 시도해주세요.");
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-gray-700"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-gray-700"
              required
            />
          </div>
          {!isVerified ? (
            <button
              onClick={verifyEmail}
              className={`w-full focus:outline-none text-white bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-md px-5 py-2.5 mt-4 dark:focus:ring-sky-900`}
            >
              인증번호 전송
            </button>
          ) : (
            <>
              <div className="flex justify-between mt-4">
                <input
                  type="text"
                  value={verificationCode}
                  onClick={onClickErrorCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="인증번호를 입력하세요."
                  className="w-4/5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-gray-700"
                  required
                />
                <button
                  onClick={verifyCode}
                  className={`w-1/5 py-2 ml-2
                   focus:outline-none text-white bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-md dark:focus:ring-sky-900`}
                >
                  확인
                </button>
              </div>
              <button
                onClick={verifyEmail}
                className={`w-full focus:outline-none text-white bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-md px-5 py-2.5 mt-4 dark:focus:ring-sky-900`}
              >
                인증번호 재전송
              </button>
            </>
          )}
          {error && <p className="text-sky-500 text-xs">{error}</p>}
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
