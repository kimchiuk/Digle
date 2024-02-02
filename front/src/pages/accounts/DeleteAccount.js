import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const DeleteAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const API_URL = "https://localhost:8000";
  const [cookies, , removeCookie] = useCookies(["isLogin"]);

  // 유저 정보 가져오는 과정
  useEffect(() => {
    // useContext token 추가하기
    axios
      .get(`${API_URL}/profile`, { withCredentials: true })
      .then((response) => {
        console.log(response);
        // 이메일 가져오기
        setEmail(response.data.email);
        setPassword(response.data.hashed_password);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  const deleteAccount = async () => {

    // 회원탈퇴 전 확인 과정
    if (!window.confirm("정말 계정을 탈퇴하시겠습니까?")) {
      return;
    }
    
    const formData = new FormData();
    formData.append('email', email)
    formData.append('password', password);

    if (!cookies.isLogin) {
      console.log("로그인 상태가 아닙니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/delete_account`, formData);
      console.log("회원 탈퇴 성공: ", response);
      removeCookie("isLogin", { path: "/", domain: "localhost" });
      navigate("/");
    } catch (error) {
      console.error("에러 발생: ", error);
    }
  };

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
