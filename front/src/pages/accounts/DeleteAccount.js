import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const DeleteAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(); // 모달 창 참조

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const [cookies, , removeCookie] = useCookies(["isLogin"]);

  useEffect(() => {
    axios
      .get(`${API_URL}/profile`, { withCredentials: true })
      .then((response) => {
        setEmail(response.data.email);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // 모달 바깥 클릭 감지 이벤트 핸들러
    const handleClickOutside = (event) => {
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const deleteAccount = async () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!window.confirm("정말 계정을 탈퇴하시겠습니까?")) {
      return;
    }

    if (!cookies.isLogin) {
      console.log("로그인 상태가 아닙니다.");
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await axios.post(`${API_URL}/delete_account`, formData, {
        withCredentials: true,
      });
      console.log("회원 탈퇴 성공: ", response);
      removeCookie("isLogin", { path: "/", domain: "localhost" });
      alert("정상적으로 회원 탈퇴 되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("에러 발생: ", error);
      alert("정확한 정보를 입력해주세요.");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg "
      >
        회원 탈퇴
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">회원 탈퇴</h3>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded w-full mb-4"
            />
            <button
              onClick={deleteAccount}
              className="px-4 py-2 bg-red-500 text-white rounded-lg w-full"
            >
              탈퇴 확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
