import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie"; // react-cookie 라이브러리에서 useCookies 불러오기
import { AuthContext } from "context/AuthContext";

const Solution2 = () => {
  const { authState } = useContext(AuthContext);

  // const [cookies] = useCookies(["isLogin"]); // isLogin 쿠키 사용
  const [email, setEmail] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  // 로딩 스피너 스타일
  const spinnerStyle = {
    borderTopColor: "transparent",
    borderStyle: "solid",
    borderWidth: "4px",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 1s linear infinite",
  };

  // 스피너 애니메이션 정의
  const spinAnimation = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;

  useEffect(() => {
    // 로그인 상태 확인
    if (authState.status === "loggedOut") {
      alert("로그인 해주세요.");
      navigate("/login"); // 로그인 페이지로 이동
    }
  }, [authState.status, navigate]); // 의존성 배열에 cookies 추가

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // 로딩 시작

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("questionTitle", questionTitle);
      formData.append("questionContent", questionContent);

      const response = await axios.post(`${API_URL}/send_faq`, formData);

      setIsLoading(false); // 로딩 종료
      if (response.status === 200) {
        // alert('질문이 성공적으로 제출되었습니다.');
        navigate("/solution/2/submit");
      } else {
        alert("오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      setIsLoading(false); // 로딩 종료
      console.error("질문 제출 중 오류 발생:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <style>{spinAnimation}</style>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
            <div
              className="loader mx-[30px] my-[20px]"
              style={spinnerStyle}
            ></div>
            <p className="mt-3 font-bold">로딩 중...</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="px-20 pt-16 pb-8 w-[600px] mx-auto h-auto flex flex-col items-start"
      >
        <h2 className="text-2xl font-bold mt-12 mb-6">FAQ</h2>

        <label
          htmlFor="questionTitle"
          className="block text-sm font-medium text-gray-700"
        >
          질문 제목:
        </label>
        <input
          type="text"
          id="questionTitle"
          name="questionTitle"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
          required
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />

        <label
          htmlFor="questionContent"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          질문 내용:
        </label>
        <textarea
          id="questionContent"
          name="questionContent"
          value={questionContent}
          onChange={(e) => setQuestionContent(e.target.value)}
          required
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          rows="4"
        />

        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          이메일:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="mt-12 p-2 bg-blue-500 text-white rounded-md self-end"
        >
          질문 제출
        </button>
      </form>
    </>
  );
};

export default Solution2;
