// VideoChat.js
import React, { useEffect, useRef, useState } from "react";
import { Janus } from "../../janus";

function VideoChat() {
  const [sessionId, setSessionId] = useState(null);
  const [roomId, setRoomId] = useState(1000);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let janusInstance = null;
  let videoRoom = null;

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
      if (janusInstance && janusInstance.send) { // 추가: send 메서드 존재 여부 확인
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
////////////////////////////////////////////////
const joinRoom = async (roomId) => {
  try {
    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = cameraStream; // 내 카메라 화면
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = screenStream; // 내 컴퓨터 화면
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



  useEffect(() => {
    initJanus();
  }, [roomId]);




  return (
    <div>
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
}

export default VideoChat;