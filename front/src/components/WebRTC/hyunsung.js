// 나중에 Video Chat 컴포넌트에 body 부분만 채워넣을 예정


import React, { useEffect, useRef, useState } from "react";
import { Janus } from "../../janus";
import { useNavigate, useLocation } from "react-router-dom";
import Video from "./Video/Video";

function Anhs() {
  const [roomId, setRoomId] = useState(null);
  const [feeds, setFeeds] = useState([]);

  let janusInstance = null;
  let videoRoom = null;
  let mystream = null;
  let janus = null;
  let sfutest = null; //비디오룸 플러그인 관리
  let username = "username-" + Janus.randomString(5); // 임시 유저네임
  let doSimulcast = false; // 동시 캐스트
  let doSimulcast2 = false;
 
  const navigate = useNavigate();
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [mainStream, setMainStream] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const room_id = parseInt(queryParams.get("roomId"), 10);
  const user_id = (queryParams.get("userId"));

  const opaqueId = "videoroomtest-" + Janus.randomString(12); //클라이언트 고유식별값
  const subscriber_mode = false; // true면 비디오 열기
  const [myFeed, setMyFeed] = useState({});
  const [receiveChat, setReceiveChat] = useState("");
  const [activeVideo, setActiveVideo] = useState(true);
  const [activeAudio, setActiveAudio] = useState(true);
  const [activeSpeaker, setActiveSpeaker] = useState(false);
  const [activeSharing, setActiveSharing] = useState(false);
  const [receiveFile, setReceiveFile] = useState(null);

  
  const connectFeed = (feed) => {
    setFeeds((prevFeeds) => [...prevFeeds, feed]);
  };

  const disconnectFeed = (feed) => {
    setFeeds((prevFeeds) => prevFeeds.filter((f) => f.rfid !== feed.rfid));
  };


  const handleMainStream = (stream, username) => {
    if (mainStream.username === username) return;
    setMainStream(() => {
      return {
        stream: stream,
        username: username,
      };
    });
  };

  useEffect(() => {
    if (room_id) {
      setRoomId(room_id); // URL에서 추출한 room_id를 상태로 설정
      initJanus();
      setupPopStateListener();

    }
  
  }, [room_id]);
// 야누스 시작합니다

  const initJanus = () => {
    Janus.init({
      debug: "all",
      callback: function () {
        ////////////////////////////////////////////////
        janus = new Janus({
          server: "http://34.125.238.83/janus",
          success: function () {
            janus.attach({
              plugin: "janus.plugin.videoroom",
              opaqueId: opaqueId,

              success: function (pluginHandle) {
                sfutest = pluginHandle;  //sfutest
                Janus.log("Plugin attached! (" + sfutest.getPlugin() + ", id=" + sfutest.getId() + ")");
                Janus.log("  -- This is a publisher/manager 입장시작");
                sfutest.send({
                  message: {
                    request: "join",
                    room: room_id,
                    ptype: "publisher",
                    display: username,
                  },
                });
      
              },
              error: function (cause) {
                // Error, can't go on...
                console.log("error", cause);
              },
              consentDialog: function (on) {
                // getusermedia 호출 되기전 true
                // 호출되고 false
                Janus.debug(
                  "Consent dialog should be " + (on ? "on" : "off") + " now"
                );
              },
              iceState: function (state) {
                Janus.log("ICE state changed to " + state);
              },
              mediaState: function (medium, on,mid) {
                Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium + " (mid=" + mid + ")");
              },
              //PeerConnection 관리합시다요 ㅡㅡ...;;
              webrtcState: function (on) {
                Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                if (!on) {
                  // 꺼짐 처리
                  return;
                }
              },
              //SDP 처리용도 =>jsep라이브러리로 미디어서버에서 온 메시지 처리부분
              onmessage: function (msg, jsep) {
                Janus.debug(" ::: Got a message (publisher) :::", msg);
                var event = msg["videoroom"];
                Janus.debug("Event : " + event);
                if (event) {
                  if (event === "joined") {
                    setMyFeed(() => ({
                      id: msg["id"],
                      pvtid: msg["private_id"],
                    }));
                    Janus.log(
                      "Successfully joined room " +
                        msg["room"] +
                        " with ID " +
                        myFeed.id
                    );

                    if (subscriber_mode) { //관전자모드 일반적으론 false임
                    } 
                    else {
                      publishOwnFeed(true);
                    }
                    if (msg["publishers"]) {
                      // 없으면 빈 리스트로 옴
                      let list = msg["publishers"];
                      console.log(list,"기존접속자목록");
                      Janus.debug(
                        "Got a list of available publishers/feeds:",
                        list
                      );
                      for (let f in list) {
                        let id = list[f]["id"];
                        let display = list[f]["display"];
                        let audio = list[f]["audio_codec"];
                        let video = list[f]["video_codec"];
                        Janus.debug(
                          "  >> [" +
                            id +
                            "] " +
                            display +
                            " (audio: " +
                            audio +
                            ", video: " +
                            video +
                            ")"
                        );
                        newRemoteFeed(id, display, audio, video); // 새로운 원격피드 등록
                      }
                    }
                  } else if (event === "destroyed") {
                    // 룸 삭제 이벤트
                    Janus.warn("The room has been destroyed!");
                    alert("룸파괴");
                  } else if (event === "event") {
                    // 새로운 접속자가 있으면
                    if (msg["publishers"]) {
                      let list = msg["publishers"];
                      Janus.debug(
                        "Got a list of available publishers/feeds:",
                        list
                      );
                      for (let f in list) {
                        let id = list[f]["id"];
                        let display = list[f]["display"];
                        let audio = list[f]["audio_codec"];
                        let video = list[f]["video_codec"];
                        Janus.debug(
                          "  >> [" +
                            id +
                            "] " +
                            display +
                            " (audio: " +
                            audio +
                            ", video: " +
                            video +
                            ")"
                        );
                        newRemoteFeed(id, display, audio, video);
                      }
                    } else if (msg["leaving"]) {
                      var leaving = msg["leaving"];
                      Janus.log("Publisher left: " + leaving);
                      var remoteFeed = null;
                      for (var i = 0; i < feeds.length; i++) {
                        if (feeds[i] && feeds[i].rfid === leaving) {
                          remoteFeed = feeds[i];
                          break;
                        }
                      }
                      if (remoteFeed != null) {
                        // 나간 피드 처리
                        Janus.debug(
                          "Feed " +
                            remoteFeed.rfid +
                            " (" +
                            remoteFeed.rfdisplay +
                            ") has left the room, detaching"
                        );
                        // ++ 해당 비디오 닫아주는 코드
                        disconnectFeed(remoteFeed);
                        remoteFeed.detach();
                      }
                    } else if (msg["error"]) {
                      // 426 코드 방 X
                      alert(msg["error"]);
                    }
                  }
                }
                if (jsep) {
                  console.log("SDP 교환:", jsep);
                  sfutest.handleRemoteJsep({ jsep: jsep });
                  var audio = msg["audio_codec"];
                  if (
                    mystream &&
                    mystream.getAudioTracks() &&
                    mystream.getAudioTracks().length > 0 &&
                    !audio
                  ) {
                    // 오디오 뮤트한 경우
                    console.log(
                      "Our audio stream has been rejected, viewers won't hear us"
                    );
                  }
                  var video = msg["video_codec"];
                  if (
                    mystream &&
                    mystream.getVideoTracks() &&
                    mystream.getVideoTracks().length > 0 &&
                    !video
                  ) {
                    // 비디오 가린경우
                    console.log(
                      "Our video stream has been rejected, viewers won't see us"
                    );
                  }
                }
              },
              
              onlocalstream: function (stream) {
                Janus.debug(" ::: Got a local stream :::", stream);
                mystream = stream;
                setMyFeed((prev) => ({
                  ...prev,
                  stream: stream,
                }));  

                if (
                  sfutest.webrtcStuff.pc.iceConnectionState !== "completed" &&
                  sfutest.webrtcStuff.pc.iceConnectionState !== "connected"
                ) {
                  // 아직 연결 중인 상태
                }

                var videoTracks = stream.getVideoTracks();
                if (!videoTracks || videoTracks.length === 0) {
                  // 웹캠 없는 경우 비디오 숨김처리
                } else {
                  // 비디오 보여줌
                }
              },
              onremotestream: function (stream) {
                // 발행하는 스트림은 보내기만함
              },
              ondataopen: function (data) {
                console.log("data channel opened");
              },
              ondata: function (data) {
                // empty
                console.log("내가받은메시지====\n", data);
              },
              oncleanup: function () {
                // 피어커넥션 플러그인 닫혔을 때
                Janus.log(
                  " ::: Got a cleanup notification: we are unpublished now :::"
                );
                mystream = null;
              },
            });
          },
        });

        
      },
      error: function (error) {
        Janus.error(error);
      },
      destroyed: function () {
        // I should get rid of this
        console.log("destroyed");
      },
    });
  };


  //내 화면을 미디어서버한테 주는거임
  function publishOwnFeed(useAudio) {
    sfutest.createOffer({
      media: {
        // data: true,
        audioRecv: false,
        videoRecv: false,
        audioSend: useAudio,
        videoSend: true,
      }, // Publishers are sendonly
      simulcast: doSimulcast,
      simulcast2: doSimulcast2,
      success: function (jsep) {
        Janus.debug("Got publisher SDP!", jsep);
        var publish = {
          request: "configure",
          audio: useAudio,
          video: true,
        };
        sfutest.send({ message: publish, jsep: jsep });
      },
      error: function (error) {
        Janus.error("WebRTC error:", error);
        console.log("webrtc error:", error);
        if (useAudio) {
          publishOwnFeed(false); // 오디오 꺼서 다시 보냄
        } else {
          // 오디오 켜서 다시 보낼 수도 있음 publishOwnFeed(true);
        }
      },
    });
}
 
// 새로운 연결
function newRemoteFeed(id, display, audio, video) {
  // A new feed has been published, create a new plugin handle and attach to it as a subscriber
  // 새 피드가 구독되었으므로, 새 플러그인 만들고 remote 연결
  console.log("새로운 연결을 탐지하였습니다.")
  let remoteFeed = null;
  janus.attach({
    plugin: "janus.plugin.videoroom",
    opaqueId: opaqueId,
    success: function (pluginHandle) {
      remoteFeed = pluginHandle;
      remoteFeed.simulcastStarted = false;
      Janus.log(
        "Plugin attached! (" +
          remoteFeed.getPlugin() +
          ", id=" +
          remoteFeed.getId() +
          ")"
      );
      Janus.log("  -- This is a subscriber");
      let subscribe = {
        request: "join",
        room: room_id,
        ptype: "subscriber",
        feed: id,
        private_id: myFeed.mypvtid,
      };
      remoteFeed.videoCodec = video;
      remoteFeed.send({ message: subscribe });
    },
    error: function (error) {
      Janus.error("  -- Error attaching plugin...", error);
    },
    onmessage: function (msg, jsep) {
      Janus.debug(" ::: Got a message (subscriber) :::", msg);
      var event = msg["videoroom"];
      Janus.debug("Event: " + event);
      if (msg["error"]) {
        console.log(msg["error"]);
      } else if (event) {
        if (event === "attached") {
          remoteFeed.rfid = msg["id"];
          remoteFeed.rfdisplay = msg["display"];
          connectFeed(remoteFeed);
          Janus.log(
            "Successfully attached to feed " +
              remoteFeed.rfid +
              " (" +
              remoteFeed.rfdisplay +
              ") in room " +
              msg["room"]
          );
        } else if (event === "event") {
          var substream = msg["substream"];
          var temporal = msg["temporal"];
          if (
            (substream !== null && substream !== undefined) ||
            (temporal !== null && temporal !== undefined)
          ) {
            if (!remoteFeed.simulcastStarted) {
              remoteFeed.simulcastStarted = true;
              // addSimulcastButtons(remoteFeed.rfindex, remoteFeed.videoCodec === "vp8" || remoteFeed.videoCodec === "h264");
            }
            // updateSimulcastButtons(remoteFeed.rfindex, substream, temporal);
          }
        } else {
          // What has just happened?
        }
      }
      if (jsep) {
        Janus.debug("Handling SDP as well...", jsep);
        // Answer and attach
        remoteFeed.createAnswer({
          jsep: jsep,
          media: { data: true, audioSend: false, videoSend: false }, // We want recvonly audio/video
          success: function (jsep) {
            Janus.debug("Got SDP!", jsep);
            var body = { request: "start", room: room_id };
            remoteFeed.send({ message: body, jsep: jsep });
          },
          error: function (error) {
            Janus.error("WebRTC error:", error);
          },
        });
      }
    },
    iceState: function (state) {
      Janus.log(
        "ICE state of this WebRTC PeerConnection (feed #" +
          remoteFeed.rfid +
          ") changed to " +
          state
      );
    },

    //RTCPeerConnection 이거 끊기면 절때안됨 로그확인용
    webrtcState: function (on) {
      Janus.log(
        "Janus says this WebRTC PeerConnection (feed #" +
          remoteFeed.rfid +
          ") is " +
          (on ? "up" : "down") +
          " now"
      );
    },
    onlocalstream: function (stream) {
         // The subscriber stream is recvonly, we don't expect anything here

    },

    onremotestream: function (stream) {
      Janus.debug("Remote feed #" + remoteFeed.rfid + ", stream:", stream);

      setFeeds((prev) => {
        let findIndex = prev.findIndex((f) => f.rfid === remoteFeed.rfid);
        let newFeed = [...prev];
        newFeed[findIndex].stream = stream;
        // newFeed[findIndex].hark = createSpeechEvents(stream);
        return newFeed;
      });
      // remoteFeed.stream = stream;
      var videoTracks = stream.getVideoTracks();
      if (!videoTracks || videoTracks.length === 0) {
        // 원격 비디오 없는 경우
      } else {
        // 있는 경우 뭐 별도 버튼처리
      }
    },
    oncleanup: function () {
      Janus.log(
        " ::: Got a cleanup notification (remote feed " + id + ") :::"
      );
      // 원격피드 끊기는 경우 처리
      console.log("다른 사용자 나감 ㅇㅇㅇ");
      disconnectFeed(remoteFeed);
    },
    ondataopen: function () {
      console.log("remote datachannel opened");
    },
    ondata: function (data) {
      // let json = JSON.parse(data);
      // let what = json["textroom"];
      // if (what === "message") {
      //   // public message
      //   setReceiveChat(() => `${json["display"]} : ${json["text"]}`);
      // } else if (what === "file") {
      //   let from = json["display"];
      //   let filename = json["text"]["filename"];
      //   let chunk = json["text"]["message"];
      //   let last = json["text"]["last"];
      //   if (!receivedFileChunk[from]) receivedFileChunk[from] = {};
      //   if (!receivedFileChunk[from][filename]) {
      //     receivedFileChunk[from][filename] = [];
      //   }
      //   receivedFileChunk[from][filename].push(chunk);
      //   if (last) {
      //     setReceiveFile(() => {
      //       return {
      //         data: receivedFileChunk[from][filename].join(""),
      //         filename: filename,
      //         from: from,
      //       };
      //     });
      //     delete receivedFileChunk[from][filename];
      //   }
      // }
    },
  });
}
  // const handleAudioActiveClick = () => {
  //   let muted = sfutest.isAudioMuted();
  //   if (muted) sfutest.unmuteAudio();
  //   else sfutest.muteAudio();
  //   setActiveAudio(() => !sfutest.isAudioMuted());
  // };

  const handleVideoActiveClick = () => {
    let muted = sfutest.isVideoMuted();
    if (muted) sfutest.unmuteVideo();
    else sfutest.muteVideo();
    setActiveVideo(() => !sfutest.isVideoMuted());
  };

  // const handleSpeakerActiveClick = () => {
  //   setActiveSpeaker((prev) => !prev);
  // };

  const handleSharingActiveClick = () => {
    if (sfutest){
      console.log(sfutest);
    if (activeSharing) {
      sfutest.createOffer({
        media: {
          replaceVideo: true,
        },
        success: function (jsep) {
          Janus.debug(jsep);
          sfutest.send({ message: { audio: true, video: true }, jsep: jsep });
        },
        error: function (error) {
          alert("WebRTC error... " + JSON.stringify(error));
        },
      });
    } else {
      if (!Janus.isExtensionEnabled()) {
        alert("확장프로그램 설치해주세요");
        return;
      }
      sfutest.createOffer({
        media: {
          video: "screen",
          replaceVideo: true,
        },
        success: function (jsep) {
          Janus.debug(jsep);
          sfutest.send({ message: { audio: true, video: true }, jsep: jsep });
        },
        error: function (error) {
          alert("WebRTC error... " + JSON.stringify(error));
        },
      });
    }
  }
    setActiveSharing((prev) => !prev);
  };



  // 방나가기 부분

  const leaveRoom = () => {
    if (janusInstance) {
      janusInstance.destroy();
    }
    if (videoRoom) {
      videoRoom.detach();
    }
    navigate("/CreateRoom");
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
    

  // Anhs 컴포넌트 내부
  const renderRemoteVideos = remoteStreams.map((participant) => (
    <div key={participant.id}>
      <p>{participant.display}</p>
      <video ref={(videoRef) => videoRef && (videoRef.srcObject = participant.stream)} autoPlay></video>
    </div>
  ));


  return (
    <>
      <div>
        <div
          className="w-full p-32"
        >
          {/* <div style={{ width: "15%", float: "left" }}>
            <UserList
              feeds={feeds}
              username={username}
              sendPrivateMessage={sendPrivateMessage}
            />
          </div> */}
          <div style={{ width: "60%", float: "flex" }}>
            <Video
              stream={mainStream.stream}
              username={mainStream.username}
              muted={true}
            />
          </div>
          {/* <div style={{ width: "25%", float: "right", height: "100%" }}>
            <Chatting
              sendChatData={sendChatData}
              receiveChat={receiveChat}
              transferFile={transferFile}
              receiveFile={receiveFile}
            />
          </div> */}
        </div>
        <div style={{ display: "flex" }}>
          {/* <button onClick={handleAudioActiveClick}>
            {activeAudio ? "소리 끄기" : "소리 켜기"}
          </button> */}
          {/* <button onClick={handleVideoActiveClick}>
            {activeVideo ? "비디오 끄기" : "비디오 켜기"}
          </button> */}
          {/* <button onClick={handleSpeakerActiveClick}>
            {activeSpeaker ? "화자 추적 비활성화" : "화자 추적 활성화"}
          </button> */}
          <button onClick={handleSharingActiveClick}>
            {activeSharing ? "화면 공유 비활성화" : "화면 공유 활성화"}
          </button>
        </div>
        <div
          style={{
            width: "100%",
            overflowX: "scroll",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              float: "left",
              margin: "3px",
            }}
          >
            {myFeed && (
              <Video
                stream={myFeed.stream}
                onClick={handleMainStream}
                username={user_id}
                muted={false}
                // activeSpeaker={activeSpeaker}
              />
            )}
          </div>
          {renderRemoteVideos}
        </div>
        <button onClick={leaveRoom}>나가기</button>
      </div>
    </>
  );
}

export default Anhs;