import React, { useState, useRef, useEffect } from "react";

function JanusPage() {
  const [isHost, setIsHost] = useState(false);
  const peerConnections = useRef({});
  const localVideoRef = useRef();
  const websocket = useRef(null); // 초기값을 null로 설정
  const [remoteVideos, setRemoteVideos] = useState([]); // 원격 비디오 상태 관리

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        websocket.current = new WebSocket("ws://localhost:8000/ws/1");
        websocket.current.onopen = () => console.log("WebSocket Connected");
        websocket.current.onmessage = handleIncomingMessage;
        websocket.current.onerror = (error) =>
          console.error("WebSocket Error:", error);
        websocket.current.onclose = () => console.log("WebSocket Disconnected");
      });

    return () => {
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      if (websocket.current) websocket.current.close(); // websocket 존재 여부 확인 후 close 호출
    };
  }, []);
  const sendMessage = (message) => {
    if (websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify(message));
    }
  };

  const createPeerConnection = (peerId) => {
    const pcConfig = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // Google의 공개 STUN 서버
      ],
    };

    const pc = new RTCPeerConnection(pcConfig);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({
          type: "ice-candidate",
          candidate: event.candidate,
          receiver: peerId,
        });
      }
    };

    pc.ontrack = (event) => {
      const streamId = event.streams[0].id;
      if (!remoteVideos.find((video) => video.id === streamId)) {
        setRemoteVideos((prevVideos) => [
          ...prevVideos,
          { id: streamId, stream: event.streams[0] },
        ]);
      }
    };

    localVideoRef.current.srcObject.getTracks().forEach((track) => {
      pc.addTrack(track, localVideoRef.current.srcObject);
    });

    peerConnections.current[peerId] = pc;
  };

  const handleIncomingMessage = (message) => {
    const data = JSON.parse(message.data);

    if (data.type === "offer") {
      createPeerConnection(data.sender);
      const pc = peerConnections.current[data.sender];
      pc.setRemoteDescription(new RTCSessionDescription(data.offer))
        .then(() => {
          return pc.createAnswer();
        })
        .then((answer) => {
          return pc.setLocalDescription(answer);
        })
        .then(() => {
          sendMessage({
            type: "answer",
            answer: pc.localDescription,
            receiver: data.sender,
          });
        });
    }
  };
  // ... 기존의 함수들 ...
  const startConnection = () => {
    setIsHost(true);
    // 호스트의 SDP 제안 생성 및 전송 로직
    createPeerConnection("peer_id"); // 예시 peer_id
    const pc = peerConnections.current["peer_id"];
    pc.createOffer().then((offer) => {
      pc.setLocalDescription(offer);
      sendMessage({ type: "offer", offer, receiver: "peer_id" });
    });
  };

  const joinConnection = () => {
    // 호스트의 연결 제안 받기
    // 이 예시에서는 호스트의 ID를 'host'로 가정합니다.
    createPeerConnection("host");
  };
  return (
    <div>
      <video ref={localVideoRef} autoPlay playsInline muted></video>
      <div>
        {remoteVideos.map((video) => (
          <VideoComponent key={video.id} stream={video.stream} />
        ))}
      </div>
      <button onClick={startConnection}>Start Connection</button>
      <button onClick={joinConnection}>Join Connection</button>
    </div>
  );
}

// 별도의 비디오 컴포넌트로 분리하여 srcObject를 설정합니다.
const VideoComponent = ({ stream }) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={ref} autoPlay playsInline />;
};

export default JanusPage;
