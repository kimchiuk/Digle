import React, { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import axios from "axios";

const FindPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate  = useNavigate ();
  const MainImg =
    "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FVjBRv%2FbtqHMwKxFgG%2FNPAxkGgvDkXeszqVT7MFm0%2Fimg.jpg";

  // 인증번호 확인 핸들러
  const verifyCode = async () => {
    try {
      // 인증번호를 서버에 전송하여 확인합니다.
      // 서버에서 확인 후, 응답이 올바르다면 비밀번호 재설정 페이지로 이동합니다.
      await axios.post("/api/", { code: verificationCode });
      navigate .push("/change_password");
    } catch (err) {
      setError("인증번호가 올바르지 않습니다. 다시 시도해주세요.");
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleEmailClick = () => {
    setEmail("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      verifyEmail();
    }
  };

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/", { email });
      setUsername(response.data.username);
      setIsVerified(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "입력하신 정보가 일치하지 않습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const FindPassword = async () => {
    if (!email || !isVerified) {
      console.log("비밀번호 찾기");
      setError("이메일 주소를 확인해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/", { email });
      setUsername(response.data.username);
    } catch (err) {
      setError(
        err.response?.data?.message || "입력하신 정보가 일치하지 않습니다."
      );
    } finally {
      setLoading(false);
      setEmail("");
      setUsername("");
    }
  };

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
              placeholder="이름을 입력하세요."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white text-gray-700"
              required
            />
          </div>
          <div className="flex justify-between">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onClick={handleEmailClick}
              onKeyPress={handleKeyPress}
              placeholder="E-mail을 입력하세요."
              className="w-4/5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white text-gray-700"
              required
            />
            <button
              onClick={verifyEmail}
              disabled={loading}
              className={`w-1/5 mx-2 focus:outline-none text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-md px-1 py-2.5 me-2 dark:focus:ring-yellow-900 ${
                loading ? "bg-gray-300" : ""
              }`}
            >
              확인
            </button>
          </div>
          {isVerified && (
            <div className="flex justify-between">
              {" "}
              {/* 추가: 인증번호 입력 필드와 확인 버튼 */}
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
                className={`w-1/5 mx-2 focus:outline-none text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-md px-1 py-2.5 me-2 dark:focus:ring-yellow-900`}
              >
                확인
              </button>
            </div>
          )}
          {isVerified && (
            <p className="text-green-500">가입된 아이디가 존재합니다!</p>
          )}
          {error && <p className="text-yellow-500">{error}</p>}
          <button
            onClick={FindPassword}
            disabled={!isVerified}
            className={`w-full focus:outline-none text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900 ${
              !isVerified ? "bg-gray-300" : ""
            }`}
          >
            인증번호 전송
          </button>
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
