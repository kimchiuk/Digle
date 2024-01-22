import React, { useEffect, useRef, useState } from "react";
import { Janus } from "../../janus";
import { useNavigate } from "react-router-dom";

function VideoChat() {
  const [sessionId, setSessionId] = useState(null);
  const [roomId, setRoomId] = useState(1000);
  const [participants, setParticipants] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let janusInstance = null;
  let videoRoom = null;
  const navigate = useNavigate();

  const initJanus = () => {
    Janus.init({
      debug: "all",
      callback: function () {
        if (!Janus.isWebrtcSupported()) {
          alert("No WebRTC support...");
          return;
        }
        createJanusInstance();
      },
    });
  };

  const createJanusInstance = () => {
    janusInstance = new Janus({
      server: "http://34.125.238.83/janus",
      success: function () {
        setSessionId(janusInstance.getSessionId());
        attachVideoRoomPlugin();
        startKeepAlive();
        setupPopStateListener();
        fetchParticipants(); // 초기화 시 참가자 정보 가져오기
      },
      error: function (error) {
        console.error("Error initializing Janus...", error);
      },
      destroyed: function () {
        console.log("Janus instance destroyed");
      },
    });
  };

  const attachVideoRoomPlugin = () => {
    janusInstance.attach({
      plugin: "janus.plugin.videoroom",
      success: function (pluginHandle) {
        videoRoom = pluginHandle;
        if (roomId) {
          joinRoom(roomId);
        } else {
          createNewRoom();
        }
      },
      error: function (error) {
        console.error("Error attaching video room plugin...", error);
      },
      onmessage: function (msg, jsep) {
        // 메시지 처리
      },
      onlocalstream: function (stream) {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      },
      onremotestream: function (stream) {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      },
    });
  };

  const startKeepAlive = () => {
    const keepAliveInterval = setInterval(() => {
      if (janusInstance && janusInstance.send) {
        janusInstance.send({ janus: "keepalive", session_id: sessionId });
      }
    }, 30000);

    return () => {
      clearInterval(keepAliveInterval);
      if (janusInstance) {
        janusInstance.destroy();
      }
      if (videoRoom) {
        videoRoom.detach();
      }
    };
  };

  const createNewRoom = () => {
    const create = { request: "create", room: 1234, ptype: "publisher" };
    videoRoom.send({ message: create });
  };

  const joinRoom = async (roomId) => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = cameraStream;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = screenStream;
      }

      const join = {
        request: "join",
        room: Number(roomId),
        ptype: "publisher",
      };
      videoRoom.send({ message: join, stream: cameraStream });
    } catch (error) {
      console.error("화면 캡처 중 오류 발생:", error);
    }
  };

  const setupPopStateListener = () => {
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  };

  const handlePopState = () => {
    leaveRoom();
  };

  const leaveRoom = () => {
    if (janusInstance) {
      janusInstance.destroy();
    }
    if (videoRoom) {
      videoRoom.detach();
    }
    navigate("/CreateRoom"); // 이동할 경로를 변경하거나 필요에 따라 다른 처리 수행
  };

  const handleGoBack = () => {
    leaveRoom();
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/participants`); // 적절한 API 엔드포인트 사용
      const data = await response.json();
      setParticipants(data.participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  useEffect(() => {
    initJanus();
  }, [roomId]);
  
  return (
    <div>
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
      <div>참가자 수: {participants.length}</div>
      <button onClick={handleGoBack}>나가기</button>
    </div>
  );
}

export default VideoChat;
