import React, { useRef, useEffect, useState } from "react";
import "./Video.css";

const Video = ({ stream, username, muted, onClickFunction }) => {
  const videoRef = useRef();
  const [mediaStream, setMediaStream] = useState(null);


  useEffect(() => {
    if (stream instanceof MediaStream) {
      videoRef.current.srcObject = stream;
    } else if (stream instanceof MediaStreamTrack) {
      const newMediaStream = new MediaStream([stream]);
      videoRef.current.srcObject = newMediaStream;
    } else {
      console.error("지원되지 않는 스트림 유형입니다:", stream);
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
    <React.Fragment>
      <div className="w-full">
        <video
          id="video"
          autoPlay
          playsInline
          ref={videoRef}
          onClick={handleClicked}
          muted={muted}
          controls={onClickFunction ? false : true}
          className="w-full rounded-xl h-[600px]"
        />
      </div>
      <div>{username}</div>
    </React.Fragment>
  );
};

export default Video;
