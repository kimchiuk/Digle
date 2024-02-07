import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Janus } from '../../janus'; // Janus 라이브러리를 불러옵니다
import TestImg from '../../assets/backgrounds/OnlineTest.png';

const TestTemp = () => {
  const [cookies] = useCookies(['isLogin']);
  const [examLink, setExamLink] = useState('');
  const [showExam, setShowExam] = useState(false);
  const [examCode, setExamCode] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();
  let sfutest = null; // Janus 비디오 핸들

  useEffect(() => {
    if (!cookies.isLogin) {
      alert('로그인 해주세요.');
      navigate('/login');
    }
  }, [cookies, navigate]);

  const fetchExamLink = () => {
    setExamLink('https://ssafy.com'); // 실제 시험 사이트 URL로 변경 필요
  };

  const joinExamRoom = async (code) => {
    try {
      const response = await axios.get(`https://localhost:8000/join/${code}/`);
      if (response.data.janus_response.janus === "success") {
        Janus.init({
          debug: "all",
          callback: function () {
            let janus = new Janus({
              server: "https://custom-janus.duckdns.org/janus", // Janus 서버 URL
              success: function () {
                janus.attach({
                  plugin: "janus.plugin.videoroom",
                  success: function (pluginHandle) {
                    sfutest = pluginHandle;
                    sfutest.send({
                      message: {
                        request: "join",
                        room: parseInt(code), // 방 번호
                        ptype: "publisher",
                        display: "username-" + Janus.randomString(5) // 임시 유저네임
                      }
                    });
                  },
                  onlocalstream: function (stream) {
                    videoRef.current.srcObject = stream;
                  },
                  // 기타 필요한 콜백 함수들
                });
              },
              error: function (error) {
                console.error("Janus 에러:", error);
              },
              destroyed: function () {
                console.log("Janus 세션 종료됨");
              }
            });
          }
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('방에 입장하는 데 실패했습니다.', error);
      return false;
    }
  };

  const handleJoinExam = async () => {
    const isValid = await joinExamRoom(examCode);
    if (isValid) {
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
    navigate('/test/finish');
  };

  useEffect(() => {
    fetchExamLink();
  }, []);

  return (
    <div className="container px-20 h-auto pt-16 pb-4 max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center">
        {!showExam && (
          <img src={TestImg} className="w-auto h-[350px] mx-auto my-[60px]" />
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
            <video ref={videoRef} className="w-auto h-[350px] mx-auto my-[60px]" autoPlay muted></video>
            <iframe src={examLink} className="w-full h-screen mb-[20px]"></iframe>
            <button
              onClick={handleEndExam}
              className="bg-red-500 hover:bg-red-700 text-white font-bold mb-[20px] py-2 px-4 rounded mt-4"
            >
              End Exam
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TestTemp;
