import React, { useRef, useEffect, useState } from "react";
import "./Video.css";

const Video = ({ stream, username, muted, onClickFunction }) => {
  const videoRef = useRef();
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    if (stream) {
      console.log(stream);

      // MediaStreamTrack의 인스턴스인 경우 처리
      if (stream instanceof MediaStreamTrack) {
        const newMediaStream = new MediaStream([stream]);
        setMediaStream(newMediaStream);
      } else if (stream.getTracks) {
        // getTracks 메서드를 가진 stream-like 객체인 경우 처리
        const tracks = stream.getTracks();
        const newMediaStream = new MediaStream(tracks);
        setMediaStream(newMediaStream);
      } else {
        console.error("지원되지 않는 스트림 유형입니다:", stream);
      }
      // 비디오 엘리먼트에 MediaStream 할당
      videoRef.current.srcObject = mediaStream;
    }
  }, [stream]);

  const handleClicked = (e) => {
    e.preventDefault();
    if (!onClickFunction) return;
    onClickFunction(videoRef.current.srcObject, username);
  };

  return (
    <>
      <div className="flex">
        <video
          id="video"
          autoPlay
          playsInline
          ref={videoRef}
          onClick={handleClicked}
          muted={muted}
          controls={onClickFunction ? false : true}
          className="w-full"
        />
      </div>
      <div>{username}</div>
    </>
  );
};

export default Video;
