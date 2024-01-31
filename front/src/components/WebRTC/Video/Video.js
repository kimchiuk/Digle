import React, { useRef, useEffect, useState } from "react";
import "./Video.css";

const Video = ({ stream, username, muted, onClickFunction }) => {
  const videoRef = useRef();
  const [mediaStream, setMediaStream] = useState(null);


  useEffect(() => {
    if (stream) {
      // MediaStreamTrack의 인스턴스인 경우 처리
      if (stream instanceof MediaStreamTrack) {
        const newMediaStream = new MediaStream([stream]);
        console.log(newMediaStream,stream);
        setMediaStream(newMediaStream);
      }

      else {
        console.error("지원되지 않는 스트림 유형입니다:", stream);
      }
      // 비디오 엘리먼트에 MediaStream 할당
    }
  }, [stream]);



  useEffect(()=>{
    videoRef.current.srcObject = mediaStream;
  },[mediaStream]);

  

  const handleClicked = (e) => {
    e.preventDefault();
    if (!onClickFunction) return;
    onClickFunction(videoRef.current.srcObject, username);
  };

  // useEffect(() => {
  //   console.log('Video 컴포넌트 업데이트:', stream, username,mediaStream);
  //   // 여기에 추가적인 업데이트 로직을 추가할 수 있습니다.
  // }, [stream]);

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
