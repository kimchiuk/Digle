import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PasswordChangeModal = ({ isOpen, onClose, email }) => {
  const [currentPassword, setCurrentPassword] = useState("");

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const verifyCurrentPassword = async (e) => {
    e.preventDefault();
    // 현재 비밀번호 확인 로직
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", currentPassword);
      const response = await axios.post(`${API_URL}/change_password`, formData);
      if (
        response.data.message ===
        "Authentication successful. Please reset your password."
      ) {
        // 현재 비밀번호 확인 성공, 다음 단계로 이동
        navigate("/reset_password");
      }
    } catch (err) {
      console.error(err);
      alert("비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="flex">
      <input
        className="border h-10 pl-2 mr-2"
        type="password"
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <button
        className="w-20 h-10  mr-2 focus:outline-none text-white bg-sky-500 hover:bg-sky-400 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm"
        onClick={verifyCurrentPassword}
      >
        확인
      </button>
      <button
        className="border-2 bg-slate-100 hover:bg-slate-200 w-20 h-10 font-medium rounded-lg text-sm"
        onClick={onClose}
      >
        변경 취소
      </button>
    </div>
  );
};

export default PasswordChangeModal;
