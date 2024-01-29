// VideoChat.js
import React, { useEffect, useRef, useState } from "react";
import { Janus } from "../../janus";
import { useNavigate, useLocation } from "react-router-dom";

function VideoChat() {
  const [roomId, setRoomId] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  let janusInstance = null;
  let videoRoom = null;
  const navigate = useNavigate();
  const [remoteStreams, setRemoteStreams] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const room_id = queryParams.get("roomId");
  const user_id = queryParams.get("userId");
  const role = queryParams.get("role");

  useEffect(() => {
    if (room_id) {
      setRoomId(room_id); // URL에서 추출한 room_id를 상태로 설정
      initJanus();
    }
  }, [room_id]);

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
        attachVideoRoomPlugin();
        startKeepAlive(janusInstance.getSessionId());
        setupPopStateListener();
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
        const event = msg["videoroom"];
        if (event === "event" && msg["publishers"]) {
          const list = msg["publishers"];
          for (let publisher of list) {
            const id = publisher["id"];
            const display = publisher["display"];
            newRemoteFeed(id, display);
          }
        }
        // jsep이 필요한 경우 처리
        if (jsep) {
          Janus.debug("SDP도 처리 중...", jsep);
          videoRoom.handleRemoteJsep({ jsep: jsep });
        }
      },
      onlocalstream: function (stream) {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      },
    });
  };

  const startKeepAlive = (sessionId) => {
    const keepAliveInterval = setInterval(() => {
      if (janusInstance && janusInstance.send) {
        // 추가: send 메서드 존재 여부 확인
        janusInstance.send({ janus: "keepalive", session_id: sessionId });
      }
    }, 30000);
    //수정부분
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
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = cameraStream; // 내 카메라 화면
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
    navigate("/CreateRoom");
  };

  const newRemoteFeed = (id, display) => {
    janusInstance.attach({
      plugin: "janus.plugin.videoroom",
      success: function (pluginHandle) {
        const remoteFeed = pluginHandle;
        remoteFeed.simulcastStarted = false;
        Janus.log("플러그인이 연결되었습니다!", remoteFeed.getPlugin());
        Janus.log("  -- 구독자 입니다");
        const subscribe = {
          request: "join",
          room: roomId,
          ptype: "subscriber",
          feed: id,
        };
        remoteFeed.videoCodec = "vp8";
        remoteFeed.send({ message: subscribe });
      },
      error: function (error) {
        Janus.error("플러그인 연결 중 오류 발생...", error);
      },
      onmessage: function (msg, jsep) {
        // 필요한 경우 새로운 원격 피드의 메시지 처리
      },
      onremotestream: function (stream) {
        // 원격 스트림 업데이트
        setRemoteStreams((prev) => [...prev, { id, display, stream }]);
      },
      oncleanup: function () {
        // 원격 피드가 분리될 때 정리
        Janus.log("원격 피드 정리:", id);
        setRemoteStreams((prev) => prev.filter((item) => item.id !== id));
      },
    });
  };

  // VideoChat 컴포넌트 내부
  const renderRemoteVideos = remoteStreams.map((participant) => (
    <div key={participant.id}>
      <p>{participant.display}</p>
      <video
        ref={(videoRef) =>
          videoRef && (videoRef.srcObject = participant.stream)
        }
        autoPlay
      ></video>
    </div>
  ));

  const handleGoBack = () => {
    leaveRoom();
    navigate("/CreateRoom");
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted></video>
      {renderRemoteVideos}
      <button onClick={handleGoBack}>나가기</button>
    </div>
  );
}

export default VideoChat;
