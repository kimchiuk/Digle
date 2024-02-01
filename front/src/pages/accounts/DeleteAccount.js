import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const API_URL = "https://localhost:5000";
  const [cookies, , removeCookie] = useCookies(["isLogin"]);

  const deleteAccount = async () => {
    if (!cookies.isLogin) {
      console.log("로그인 상태가 아닙니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/delete_account`);
      console.log("회원 탈퇴 성공: ", response);
      removeCookie("isLogin", { path: "/", domain: "localhost" });
      navigate("/");
    } catch (error) {
      console.error("에러 발생: ", error);
    }
  };

  useEffect(() => {
    deleteAccount();
  }, [navigate, removeCookie, cookies.isLogin]);

  return (
    <div>
      <button
        onClick={deleteAccount}
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        회원 탈퇴
      </button>
    </div>
  );
};

export default DeleteAccount;
