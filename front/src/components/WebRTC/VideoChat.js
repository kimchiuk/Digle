// VideoChat.js
import React, { useEffect, useRef, useState } from "react";
import Janus from "../../janus"; // Janus 라이브러리의 경로

function VideoChat() {
  const [roomId, setRoomId] = useState(null);
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
        janusInstance = new Janus({
          server: "YOUR_JANUS_SERVER_URL",
          success: function () {
            janusInstance.attach({
              plugin: "janus.plugin.videoroom",
              success: function (pluginHandle) {
                videoRoom = pluginHandle;
                // 방 생성 또는 참여 로직 구현
                if (roomId) {
                  joinRoom(roomId); // 참여할 방이 있으면 해당 방에 참여
                } else {
                  createNewRoom(); // 방이 없으면 새로운 방 생성
                }
              },
              error: function (error) {
                console.error("Error attaching plugin...", error);
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
          },
          error: function (error) {
            console.error("Error initializing Janus...", error);
          },
          destroyed: function () {
            console.log("Janus instance destroyed");
          },
        });
      },
    });
  };
  const createNewRoom = () => {
    // 새 방 생성
    const create = { request: "create", room: 1234, ptype: "publisher" };
    videoRoom.send({ message: create });
  };

  const joinRoom = (roomId) => {
    // 기존 방에 참여
    const register = { request: "join", room: roomId, ptype: "publisher" };
    videoRoom.send({ message: register });
  };
  useEffect(() => {
    initJanus();

    return () => {
      if (janusInstance) {
        janusInstance.destroy();
      }
    };
  }, []);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
}

export default VideoChat;

// roomId: 방 ID는 실제 애플리케이션에서는 사용자에 의해 설정되거나 서버로부터 받아와야 합니다. 여기서는 예시로 하드코딩한 값(1234)을 사용하고 있습니다.
// 방 생성 및 참여 요청에는 다양한 추가 옵션을 포함할 수 있습니다. 예를 들어, description, publishers, bitrate, 등의 추가 설정을 제공할 수 있습니다.
// onmessage 콜백에서는 Janus로부터의 메시지를 처리하고, 필요에 따라 로컬 및 원격 비디오 스트림을 설정하거나 갱신합니다.
// 이 코드는 Janus 플러그인 및 WebRTC 연결의 기본적인 사용법을 보여줍니다. 실제 사용 시에는 보안, 네트워크 조건, 오류 처리, 사용자 인터페이스 등을 고려하여 추가적인 개발이 필요합니다.
