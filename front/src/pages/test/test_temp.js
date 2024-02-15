import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Janus } from "../../janus";
import TestImg from "../../assets/backgrounds/OnlineTest.png";
import { AuthContext } from "context/AuthContext";

const TestTemp = () => {
  // const [cookies] = useCookies(['isLogin']);
  const { setAuthState, authState } = useContext(AuthContext);
  const [showExam, setShowExam] = useState(false);
  const [examCode, setExamCode] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");

  const API_URL = process.env.REACT_APP_API_BASE_URL;

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
    // 사용자 이름과 유형을 가져오는 함수
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_user_name_and_type`, {
          withCredentials: true,
        });
        setUserName(response.data.user_name);
        setUserType(response.data.user_type);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (authState.status === "loggedOut") {
      alert("로그인 해주세요.");
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [authState.status, navigate]);

  const handleJoinExam = async () => {
    setIsLoading(true);
    try {
      // 서버에 시험 코드를 보내고 방 정보 받기
      const response = await axios.get(`${API_URL}/join/${examCode}`);
      if (response.data.message === "Successfully joined the room") {
        setIsLoading(false);
        console.log(response.data.janus_response.message.substring(12, 18));

        const roomNumber = response.data.janus_response.message.substring(
          12,
          18
        );

        navigate(
          `/test_user?roomId=${roomNumber}&userId=${userName}&role=publisher`
        );
      } else {
        alert("Invalid exam code or failed to join the room.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error joining room:", error);
    }
  };

  return (
    <>
      <div className="container flex flex-col items-center justify-center px-20 h-auto pt-16 pb-4 max-w-2xl mx-auto">
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
        {!showExam && (
          <img src={TestImg} className="w-auto h-[350px] mx-auto my-[60px]" />
        )}
        {!showExam && (
          <>
            <input
              type="text"
              value={examCode}
              onChange={(e) => setExamCode(e.target.value)}
              placeholder="초대 코드를 입력하세요."
              className="mb-4 p-2 border-2 "
            />
            <button
              onClick={handleJoinExam}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold mb-[20px] py-2 px-4 rounded"
            >
              참여하기
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default TestTemp;
