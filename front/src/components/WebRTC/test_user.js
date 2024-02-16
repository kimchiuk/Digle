// VideoChat.js
import React, { useEffect, useRef, useState } from "react";
import { Janus } from "../../janus";
import { useNavigate, useLocation } from "react-router-dom";
import Video2 from "./Video/Video2";
import Chatting from "./Chatting/Chatting";
import UserList from "./UserList/UserList";

import axios from "axios";
import GetInviteCode from "./Chatting/GetInviteCode";
import hark from "hark";

// V-Chat에 추가해야댐
import micOn from "../../assets/webRTC/discord/micOn.png";
import micOff from "../../assets/webRTC/discord/micOff.png";
import camOn from "../../assets/webRTC/discord/camOn.png";
import camOff from "../../assets/webRTC/discord/camOff.png";
import capture from "../../assets/webRTC/discord/capture.png";

let sfutest = null;
// let username = "username-" + Janus.randomString(5); // 임시 유저네임
let receivedFileChunk = {};

const TestUser = () => {
  const [mainStream, setMainStream] = useState({}); //지금 메인으로 보여주는 화면
  const [feeds, setFeeds] = useState([]); //다른사람의 화면배열 (rfid,rfdisplay)
  const [myFeed, setMyFeed] = useState({}); //내 컴퓨터화면 공유
  const [receiveChat, setReceiveChat] = useState("");
  const [activeVideo, setActiveVideo] = useState(true);
  const [activeAudio, setActiveAudio] = useState(true);
  const [activeSharing, setActiveSharing] = useState(false);
  const [receiveFile, setReceiveFile] = useState(null);
  const location = useLocation();
  const [captureFrames, setCaptureFrames] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const myroom = parseInt(queryParams.get("roomId"), 10);
  const navigate = useNavigate();
  const username = queryParams.get("userId");
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const [chatData, setChatData] = useState([]);
  const [newMessageCount, setNewMessageCount] = useState(0); // 새 메시지 카운트 상태

  const connectFeed = (newFeed) => {
    setFeeds((prevFeeds) => {
      if (prevFeeds.some((feed) => feed.rfid === newFeed.rfid)) {
        return prevFeeds;
      }
      return [...prevFeeds, newFeed];
    });
  };

  const disconnectFeed = (rfid) => {
    setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.rfid !== rfid));
  };

  const createSpeechEvents = (stream) => {
    let speechEvents = hark(stream, {});
    return speechEvents;
  };

  const handleMainStream = (stream, username) => {
    console.log("메인스트림변경");
    if (mainStream.username === username) return;
    setMainStream((prevMainStream) => {
      return {
        ...prevMainStream,
        stream: stream,
        username: username,
      };
    });
  };

  const getMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyFeed({ stream: stream });
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const handleEndExamClick = () => {
    navigate("/test/finish");
  };

  useEffect(() => {
    let servers = ["https://custom-janus.duckdns.org/janus"];
    let opaqueId = "videoroomtest-" + Janus.randomString(12); // 개인 식별
    let janus = null;
    let subscriber_mode = false; // true면 비디오 열어줌
    let mystream = null;
    let doSimulcast = false; // 동시 캐스트
    let doSimulcast2 = false;

    getMediaStream();

    Janus.init({
      debug: "all",
      //   dependencies: Janus.useDefaultDependencies(),
      callback: function () {
        janus = new Janus({
          server: servers,
          success: function () {
            janus.attach({
              plugin: "janus.plugin.videoroom",
              opaqueId: opaqueId,
              success: function (pluginHandle) {
                sfutest = pluginHandle; //요청이성공햇으니 어태치가 성공햇으니깐
                Janus.log(
                  "Plugin attached! (" +
                    sfutest.getPlugin() +
                    ", 비디오 플러그인 id=" +
                    sfutest.getId() +
                    ")"
                );
                Janus.log("미디어 플러그인 접속 완료 ");
                // 자동 입장처리
                sfutest.send({
                  message: {
                    request: "join",
                    room: myroom,
                    ptype: "publisher",
                    display: username,
                    data: true,
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
              mediaState: function (medium, on) {
                Janus.log(
                  "Janus " +
                    (on ? "started" : "stopped") +
                    " receiving our " +
                    medium
                );
              },
              webrtcState: function (on) {
                Janus.log(
                  "Janus says our WebRTC PeerConnection is " +
                    (on ? "up" : "down") +
                    " now"
                );
                if (!on) {
                  alert("방에서 퇴장하였습니다.");
                  navigate("/");
                }
              },

              ondataopen: function (data) {
                console.log("data channel opened");
              },

              onmessage: function (msg, jsep) {
                //msg,jsep같이와 offer로보냇자 /answer
                Janus.debug(" ::: Got a message (publisher) :::", msg);
                var event = msg["videoroom"];
                Janus.debug("Event : " + event);
                if (event) {
                  if (event === "joined") {
                    // setMyFeed(() => ({
                    //   id: msg["id"],
                    //   pvtid: msg["private_id"],
                    // }));
                    // myid = msg["id"];
                    // mypvtid = msg["private_id"];
                    Janus.log(
                      "Successfully joined room " +
                        msg["room"] +
                        " with ID " +
                        msg["id"]
                    );
                    if (subscriber_mode) {
                      // 비디오 숨김 무시하고
                    } else {
                      console.log("publishOwnFeed시작");
                      publishOwnFeed(true);
                    }

                    // 기존의 접속자 있으면
                    if (msg["publishers"]) {
                      // 없으면 빈 리스트로 옴
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
                        console.log("새로운 원격피드 등록");
                        newRemoteFeed(id, display, audio, video); // 새로운 원격피드 등록
                      }
                    }
                  } else if (event === "destroyed") {
                    // 룸 삭제 이벤트
                    Janus.warn("The room has been destroyed!");
                    alert("방이 삭제 되었습니다.");
                  } else if (event === "event") {
                    // 새로운 접속자가 있으면
                    if (msg["publishers"]) {
                      console.log("접속자발생!", msg);
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
                        newRemoteFeed(id, display, audio, video); //publisher true'''...
                      }
                    } else if (msg["leaving"]) {
                      console.log(feeds);
                      let leaving = msg["leaving"];
                      Janus.log("Publisher left: " + leaving); //여기서 leaveing은 나간놈의 고유rfid임

                      disconnectFeed(leaving);
                    } else if (msg["error"]) {
                      // 에러 처리
                      alert(msg["error"]);
                    }
                  }
                }

                ///
                if (jsep) {
                  console.log(
                    "jsep =============",
                    jsep,
                    "마이스트림:",
                    mystream
                  );
                  sfutest.handleRemoteJsep({ jsep: jsep });
                  var audio = msg["audio_codec"];
                  if (!audio) {
                    // 오디오 뮤트한 경우
                    console.log(
                      "Our audio stream has been rejected, viewers won't hear us"
                    );
                  }
                  var video = msg["video_codec"];
                  if (!video) {
                    // 비디오 가린경우
                    console.log(
                      "Our video stream has been rejected, viewers won't see us"
                    );
                  }
                }
              },

              disconnectFeed: function (rfid) {
                // rfid와 일치하는 피드를 feeds 배열에서 제거
                setFeeds((prevFeeds) =>
                  prevFeeds.filter((feed) => feed.rfid !== rfid)
                );
              },

              onlocaltrack: function (track, on) {
                Janus.debug(" ::: Got a local track :::", track);
                if (track.kind === "video") {
                  setMyFeed((prev) => ({
                    ...prev,
                    stream: track,
                  }));

                  setMainStream((prev) => ({
                    ...prev,
                    stream: track,
                  }));
                }

                if (
                  sfutest.webrtcStuff.pc.iceConnectionState !== "completed" &&
                  sfutest.webrtcStuff.pc.iceConnectionState !== "connected"
                ) {
                  // 아직 연결 중인 상태
                }

                if (track.kind === "video") {
                  // 비디오 트랙인 경우
                  if (track.enabled) {
                    // 비디오 보여줌
                  } else {
                    // 비디오 숨김처리
                  }
                }
              },
              onremotetrack: function (track) {
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

    function publishOwnFeed() {
      sfutest.createOffer({
        // Send video only, no audio
        media: { audioSend: false, videoSend: true, data: true },
        success: function (jsep) {
          Janus.debug("Got publisher SDP!");
          Janus.debug(jsep);
          let publish = { request: "configure", audio: false, video: true };
          sfutest.send({ message: publish, jsep: jsep });
        },
        error: function (error) {
          Janus.error("WebRTC error:", error);
        },
      });
    }

    ///////////////////////////////////새로운참여자가 등록햇을경우////////////////////////
    function newRemoteFeed(id, display, audio, video) {
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
            room: myroom,
            ptype: "subscriber",
            display: display,
            feed: id,
            private_id: myFeed.mypvtid,
          };
          remoteFeed.videoCodec = video;
          remoteFeed.send({ message: subscribe }); //
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
              // let newMessage = `User ${display} joined.`;
              // setReceiveChat(prev => prev + "\n" + newMessage);
              connectFeed(remoteFeed);
              Janus.log(
                "Successfully attached to rffeed " +
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
                var body = { request: "start", room: myroom };
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
        webrtcState: function (on) {
          Janus.log(
            "Janus says this WebRTC PeerConnection (feed #" +
              remoteFeed.rfid +
              ") is " +
              (on ? "up" : "down") +
              " now"
          );
        },
        onlocaltrack: function (stream) {
          // The subscriber stream is recvonly, we don't expect anything here
        },

        //여기서 남의 setfeeds를 설정해야함 ㅇㅇㅋ..
        onremotetrack: function (track) {
          if (track.kind === "video") {
            setFeeds((prevFeeds) => {
              // 이미 제거된 피드는 처리하지 않음
              if (!prevFeeds.find((feed) => feed.rfid === remoteFeed.rfid)) {
                return prevFeeds;
              }

              // 피드에 비디오 트랙 추가
              if (!remoteFeed.streams) {
                remoteFeed.streams = {};
              }
              if (!remoteFeed.streams[track.id]) {
                remoteFeed.streams[track.id] = new MediaStream();
              }
              remoteFeed.streams[track.id].addTrack(track);

              return prevFeeds.map((feed) =>
                feed.rfid === remoteFeed.rfid
                  ? { ...feed, stream: remoteFeed.streams[track.id] }
                  : feed
              );
            });
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
          console.log("데이터가 도착했습니다.", data);
          let json = JSON.parse(data);
          let what = json["textroom"];
          if (what === "message") {
            // public message
            const messageObj = {
              from: json["display"],
              to: json["to"] || "all", // 'to' 필드가 없다면 'all'로 처리
              text: json["text"],
            };
            // 메시지 객체를 상태로 설정
            console.log(messageObj);
            setReceiveChat(messageObj);
          }

          //
          else if (what === "file") {
            let from = json["display"];
            let filename = json["text"]["filename"];
            let chunk = json["text"]["message"];
            let last = json["text"]["last"];
            if (!receivedFileChunk[from]) receivedFileChunk[from] = {};
            if (!receivedFileChunk[from][filename]) {
              receivedFileChunk[from][filename] = [];
            }
            receivedFileChunk[from][filename].push(chunk);
            if (last) {
              setReceiveFile(() => {
                return {
                  data: receivedFileChunk[from][filename],
                  filename: filename,
                  from: from,
                };
              });
              delete receivedFileChunk[from][filename];
            }
          }
        },
      });
    }
  }, []);

  useEffect(() => {
    console.log("내마이피드가 변경습니다요:", myFeed);
  }, [myFeed]);

  useEffect(() => {
    // hark 인스턴스를 저장할 맵 초기화
    const speechEventsMap = new Map();

    // 각 피드에 대해 hark 인스턴스 생성 및 이벤트 리스너 설정
    feeds.forEach((feed) => {
      if (!feed.stream || feed.stream.getAudioTracks().length === 0) {
        // 오디오 트랙이 없는 경우 건너뜁니다.
        return;
      }

      const speechEvents = hark(feed.stream, {});
      speechEvents.on("speaking", () => {
        handleMainStream(feed.stream, feed.rfdisplay);
      });

      // 생성된 hark 인스턴스를 맵에 저장
      speechEventsMap.set(feed.rfid, speechEvents);
    });

    // 컴포넌트가 언마운트될 때 리소스 정리
    return () => {
      speechEventsMap.forEach((speechEvents, rfid) => {
        speechEvents.removeAllListeners(); // 모든 이벤트 리스너 제거
        speechEvents.stop(); // hark 인스턴스 정지
      });
    };
  }, [feeds]); // feeds 배열이 변경될 때마다 실행

  useEffect(() => {
    console.log("메인스트림이 설정됬습니다요:", mainStream);
  }, [mainStream]);

  const sendChatData = (data) => {
    let message = {
      textroom: "message",
      room: myroom,
      text: data,
      transaction: Janus.randomString(12),
      display: username,
    };
    sfutest.data({
      text: JSON.stringify(message),
      error: function (err) {
        console.log(err);
      },
      success: function () {
        console.log("datachannel message sent");
      },
    });
  };

  const transferFile = (data) => {
    let message = {
      textroom: "file",
      room: myroom,
      text: data,
      display: username,
    };
    sfutest.data({
      text: JSON.stringify(message),
      error: function (err) {
        console.log(err);
      },
      success: function () {
        console.log("datachannel file sent...");
      },
    });
  };

  const sendPrivateMessage = (data, target) => {
    let message = {
      textroom: "message",
      room: myroom,
      text: data,
      to: target, // rfid
      transaction: Janus.randomString(12),
      display: username,
    };
    sfutest.data({
      text: JSON.stringify(message),
      error: function (err) {
        console.log(err);
      },
      success: function () {
        console.log("Private message sent to " + target);
      },
    });
  };

  const kickParticipant = (participantId) => {
    const kick = { request: "kick", room: myroom, id: participantId };
    sfutest.send({ message: kick });
  };

  const handleSharingActiveClick = () => {
    if (activeSharing) {
      sfutest.createOffer({
        media: {
          replaceVideo: true,
          data: true,
        },
        success: function (jsep) {
          Janus.debug(jsep);
          sfutest.send({
            message: { audio: true, video: true, data: true },
            jsep: jsep,
          });
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
          data: true,
        },
        success: function (jsep) {
          Janus.debug(jsep);
          sfutest.send({
            message: { audio: true, video: true, data: true },
            jsep: jsep,
          });
        },
        error: function (error) {
          alert("WebRTC error... " + JSON.stringify(error));
        },
      });
    }
    setActiveSharing((prev) => !prev);
  };

  // useEffect(() => {
  //   if (activeSpeaker) {
  //     for (let i = 0; i < feeds.length; i++) {
  //       if (!feeds[i].hark) continue;
  //       feeds[i].hark.on("speaking", () => {
  //         handleMainStream(feeds[i].stream, feeds[i].rfdisplay);
  //       });
  //     }
  //   } else {
  //     for (let i = 0; i < feeds.length; i++) {
  //       if (!feeds[i].hark) continue;
  //       feeds[i].hark.off("speaking");
  //     }
  //   }
  // }, [activeSpeaker]);

  const handleCaptureClick = () => {
    setCaptureFrames(true);
    alert("사용자 이미지를 수집하였습니다.");
  };

  useEffect(() => {
    if (receiveChat) {
      const { from, text, to } = receiveChat;
      // 현재 사용자가 메시지의 수신자이거나, 메시지가 모두에게 보내진 경우에만 표시
      if (to === "all" || to === username) {
        let messageToShow;
        if (to === "all") {
          // 모두에게 보낸 메시지
          messageToShow = `${from}: ${text}`;
        } else {
          // 귓속말
          messageToShow = `귓속말 (${from} -> ${to}): ${text}`;
        }
        setChatData((prev) => [...prev, messageToShow]);
      }
      setNewMessageCount((prevCount) => prevCount + 1); // 새 메시지가 수신될 때마다 카운트 증가
    }
  }, [receiveChat, username]);

  const [isChatVisible, setIsChatVisible] = useState(false);

  // 채팅창 토글 함수
  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  const renderRemoteVideos = feeds.map((feed) => {
    return (
      <div
        key={feed.rfid}
        onClick={() => handleMainStream(feed.stream, feed.rfdisplay)}
      >
        <Video2
          key={feed.rfid}
          stream={feed.stream}
          username={feed.rfdisplay}
          muted={true}
        />
      </div>
    );
  });

  const handleLeave = () => {
    // 사용자에게 확인을 요청하는 팝업 표시
    const confirmLeave = window.confirm("정말 시험을 종료하시겠습니까?");

    // 사용자가 '예'를 클릭한 경우
    if (confirmLeave) {
      if (myFeed && myFeed.id) {
        console.log(myFeed.id);
        disconnectFeed(myFeed.id);
        sfutest.send({
          message: {
            request: "leave",
            room: myroom,
          },
        });
      }
      if (sfutest) {
      sfutest.detach({
        success: function () {
          navigate("/test/finish");
        },
      });
    }
    }
    // 사용자가 '아니오'를 클릭한 경우 아무것도 하지 않음
  };

  const fetchRoomInfo = async (roomId) => {
    try {
      const response = await axios.get(`${API_URL}/get_testroom/${roomId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Error fetching room info", response.status);
      }
    } catch (error) {
      console.error("Error fetching room info", error);
    }
  };

  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    const loadRoomInfo = async () => {
      const info = await fetchRoomInfo(myroom); // `myroom`은 현재 방의 ID
      setRoomInfo(info);
    };

    loadRoomInfo();
  }, [myroom]);

  return (
    <>
      <div className="flex justify-center w-full h-screen">
        {myFeed && myFeed.stream && (
          <div className="flex justify-center w-full h-full">
            <Video2 stream={myFeed.stream} muted={true} />
          </div>
        )}
      </div>

      {/* 버튼과 채팅창 컨테이너 */}
      <div className="relative w-full p-4 bg-white">
        {/* 채팅창 */}
        {isChatVisible && (
          <div className="absolute left-4 bottom-full mb-2 bg-white p-4 rounded shadow-lg h-[620px] w-[400px] z-10">
            <Chatting
              sendChatData={sendChatData}
              receiveChat={receiveChat}
              transferFile={transferFile}
              receiveFile={receiveFile}
              feeds={feeds}
              username={username}
              sendPrivateMessage={sendPrivateMessage}
            />
          </div>
        )}

        {/* 버튼들 */}
        <div className="flex justify-between">
          {/* Show Chat 버튼 */}
          <button
            onClick={toggleChat}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isChatVisible ? "Hide Chat" : "Show Chat"}
          </button>

          {/* End Exam 버튼 */}
          <button
            onClick={handleLeave}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            End Exam
          </button>
        </div>
      </div>
    </>
  );
};

export default TestUser;
