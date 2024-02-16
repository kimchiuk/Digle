import React, { useRef, useEffect } from "react";
import "./Video.css";

const Video = ({ audioTrack, videoTrack, username, muted, onClickFunction, className }) => {
  const videoRef = useRef();

  useEffect(() => {
    const stream = new MediaStream();
    if (audioTrack) {
      stream.addTrack(audioTrack);
    }
    if (videoTrack) {
      stream.addTrack(videoTrack);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [audioTrack, videoTrack]); // 의존성 배열에 audioTrack와 videoTrack 추가

  const handleClicked = (e) => {
    e.preventDefault();
    if (onClickFunction) {
      onClickFunction(videoRef.current.srcObject, username);
    }
  };

  return (
    <div onClick={handleClicked} className={className}>
      <video
        autoPlay
        playsInline
        ref={videoRef}
        muted={muted}
        controls={!onClickFunction}className="w-full h-full"
      />
      <div>{username}</div>
    </div>
  );
};

export default Video;
