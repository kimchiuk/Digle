import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TestImg from '../../assets/OnlineTest.png'

const TestTemp = () => {
  const [examLink, setExamLink] = useState('');
  const [showExam, setShowExam] = useState(false);
  const [examCode, setExamCode] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const fetchExamLink = () => {
    setExamLink('https://ssafy.com'); // 실제 시험 사이트 URL로 변경 필요
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const joinExamRoom = async (code) => {
    // 방 참여 로직 (유효한 코드인지 검증 후 방에 참여)
    // 예시: 서버에 코드 유효성 확인 요청
    // TODO: 실제 서버로 요청하는 로직 필요
    const isValid = code === "12345"; // 예시: 유효한 코드는 "12345"
    return isValid;
  };

  const handleJoinExam = async () => {
    const isValid = await joinExamRoom(examCode);
    if (isValid) {
      await startCamera();
      setShowExam(true);
    } else {
      alert("Invalid exam code.");
    }
  };

  const handleEndExam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowExam(false);
    setExamCode('');
    navigate('/test/finish'); // '/test/finish' 페이지로 이동
  };

  useEffect(() => {
    fetchExamLink();
  }, []);

  return (
    <div className="container px-20 h-auto pt-16 pb-4 max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center">
        {!showExam && (
          <img src={TestImg} className="w-auto h-[350px] mx-auto my-[60px] "></img>
        )}
        {!showExam && (
          <>
            <input
              type="text"
              value={examCode}
              onChange={(e) => setExamCode(e.target.value)}
              placeholder="Enter Exam Code"
              className="mb-4 p-2 border-2"
            />
            <button
              onClick={handleJoinExam}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold mb-[20px] py-2 px-4 rounded"
            >
              Join Exam
            </button>
          </>
        )}

        {showExam && (
          <>
            <iframe src={examLink} className="w-full h-screen mb-[20px]"></iframe>
            <button
              onClick={handleEndExam}
              className="bg-red-500 hover:bg-red-700 text-white font-bold mb-[20px] py-2 px-4 rounded mt-4"
            >
              End Exam
            </button>
          </>
        )}

        <video ref={videoRef} className="fixed top-0 right-0 m-4 w-1/4 h-auto" style={{ display: showExam ? 'block' : 'none' }}></video>
      </div>
    </div>
  );
};

export default TestTemp;
