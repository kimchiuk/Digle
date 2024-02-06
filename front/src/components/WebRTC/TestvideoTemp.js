import React, { useEffect, useRef, useState } from "react";
import { Janus } from "../../janus";
import Video from "./Video/Video";

const TestvideoTemp = () => {
  const [myFeed, setMyFeed] = useState({});
  const videoRef = useRef(null);

  useEffect(() => {
    let servers = ["https://custom-janus.duckdns.org/janus"];
    let opaqueId = "videoroomtest-" + Janus.randomString(12);
    let janus = null;

    Janus.init({
      debug: "all",
      callback: function () {
        janus = new Janus({
          server: servers,
          success: function () {
            // ... Janus 서버 연결 성공 처리

            // 자신의 비디오 스트림 처리
            janus.attach({
              plugin: "janus.plugin.videoroom",
              opaqueId: opaqueId,
              success: function (pluginHandle) {
                // ... Plugin 연결 성공 처리
              },
              onlocaltrack: function (track, on) {
                // 로컬 비디오 스트림 처리
                if (track.kind === "video") {
                  setMyFeed({ stream: new MediaStream([track]) });
                }
              },
              // ... 다른 이벤트 핸들러들
            });
          },
          // ... Janus 서버 연결 오류 처리
        });
      },
    });
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        {myFeed.stream && (
          <Video
            stream={myFeed.stream}
            username={"내 화면"}
            muted={true}
            style={{ width: "200px", height: "150px" }} // 비디오 크기 설정
          />
        )}
      </div>
    </div>
  );
};

export default TestvideoTemp;
