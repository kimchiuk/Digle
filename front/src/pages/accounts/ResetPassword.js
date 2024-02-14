import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainImg from "../../assets/main.png";
import { useCookies } from "react-cookie";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [isPwd, setIsPwd] = useState("");
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["email"]); // Coockies 이름임

  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const handleResetPassword = async () => {
    const formData = new FormData();
    formData.append("email", cookies.email);
    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // axios를 사용하여 서버에 '비밀번호 재설정' 요청을 보냅니다.
      await axios.post(`${API_URL}/reset_password`, formData);
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setPasswordMsg("");
      removeCookie("email");
      console.log("비밀번호가 수정되었습니다.");
      navigate("/login");
    } catch (err) {
      setError("비밀번호 변경에 실패하였습니다. 다시 시도해주세요.");
      setPasswordMsg("");
      console.error(error);
    }
  };

  const handlePasswordChange = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMsg(
        "대 · 소문자, 숫자, 특수문자를 조합하여 8자 이상 입력하세요."
      );
      setIsPwd(false);
    } else {
      setPasswordMsg("안전한 비밀번호입니다.");
      setIsPwd(true);
    }
  };

  const clickConfirmPassword = () => {
    setPasswordMsg("");
    setError("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <img className="absolute w-full h-full object-cover" src={MainImg} />
      <div className="relative p-8 bg-black bg-opacity-70 rounded shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          비밀번호 변경
        </h2>
        <div className="flex flex-col space-y-6">
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="새 비밀번호"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-gray-700"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onClick={clickConfirmPassword}
            placeholder="새 비밀번호 확인"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-gray-700"
          />
          {passwordMsg && <p className="text-sky-500 text-xs">{passwordMsg}</p>}
          {error && <p className="text-sky-500 text-xs">{error}</p>}
          <button
            onClick={handleResetPassword}
            className="w-full focus:outline-none text-white bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-md px-5 py-2.5 mt-2"
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
