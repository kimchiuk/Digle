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
    <>
      <div className="">
        <div className="border w-60 flex justify-between gap-2">
          <input
            className=""
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 rounded-md w-20 h-10 text-white "
            onClick={verifyCurrentPassword}
          >
            확인
          </button>
        </div>
        <div className="justify-between flex w-60">
          <div></div>
          <button
            className="bg-blue-500 rounded-md w-20 h-10 text-white"
            onClick={onClose}
          >
            변경 취소
          </button>
        </div>
      </div>
    </>
  );
};

export default PasswordChangeModal;
