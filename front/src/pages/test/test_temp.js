import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Janus } from '../../janus'; // Make sure this path is correct
import TestImg from '../../assets/backgrounds/OnlineTest.png'; // Make sure this path is correct

const TestTemp = () => {
  const [cookies] = useCookies(['isLogin']);
  const [examLink, setExamLink] = useState('');
  const [showExam, setShowExam] = useState(false);
  const [examCode, setExamCode] = useState('');
  const [showWebcam, setShowWebcam] = useState(false); // 웹캠 표시 여부 상태 추가
  const videoRef = useRef(null);
  const navigate = useNavigate();
  let sfutest = null;

  useEffect(() => {
    if (!cookies.isLogin) {
      alert('로그인 해주세요.');
      navigate('/login');
    }
  }, [cookies, navigate]);

  const fetchExamLink = () => {
    setExamLink('https://ssafy.com'); // Replace with your actual exam link
  };

  // 웹캠 활성화 함수
  const activateWebcam = async () => {
    setShowWebcam(true); // 웹캠 표시 상태를 true로 설정
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      videoRef.current.srcObject = stream; // 웹캠 스트림을 video 요소의 srcObject에 할당하여 표시
      videoRef.current.play(); // 영상 재생 시작
    } catch (error) {
      console.error("Failed to get user media:", error);
    }
  };

  const publishOwnFeed = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
  
      sfutest.createOffer({
        media: {
          audioRecv: false,
          videoRecv: false,
          audioSend: audioTrack ? true : false,
          videoSend: videoTrack ? true : false
        },
        success: function (jsep) {
          Janus.debug("Got publisher SDP!");
          Janus.debug(jsep);
          let publish = { request: "configure", audio: audioTrack ? true : false, video: videoTrack ? true : false };
          sfutest.send({ message: publish, jsep: jsep });
        },
        error: function (error) {
          Janus.error("WebRTC error:", error);
        }
      });
    } catch (error) {
      console.error("Failed to get user media:", error);
    }
  };

  const joinExamRoom = async (code) => {
    try {
      const response = await axios.get(`https://localhost:8000/join/${code}/`);
      if (response.data.janus_response.janus === "success") {
        Janus.init({
          debug: "all",
          callback: function () {
            let janus = new Janus({
              server: "https://custom-janus.duckdns.org/janus",
              success: function () {
                janus.attach({
                  plugin: "janus.plugin.videoroom",
                  success: function (pluginHandle) {
                    sfutest = pluginHandle;
                    sfutest.send({
                      message: {
                        request: "join",
                        room: parseInt(code, 10),
                        ptype: "publisher",
                        display: "username-" + Janus.randomString(5)
                      }
                    });
                    publishOwnFeed();
                  },
                  onlocalstream: function (stream) {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                  },
                  // Other callbacks...
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
      activateWebcam(); // 시험 참여 시 웹캠 활성화
    } else {
      alert("Invalid exam code.");
    }
  };

  const handleEndExam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowExam(false);
    setShowWebcam(false); // 웹캠 표시 상태를 false로 설정
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
            {showWebcam && (
              <video ref={videoRef} className="w-auto h-[350px] mx-auto my-[60px]" autoPlay muted></video>
            )}
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
