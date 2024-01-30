import React, { useRef, useEffect, useState } from "react";
import "./Video.css";

const Video = ({ stream, username, muted, onClickFunction }) => {
  const videoRef = useRef();
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    const handleStreamUpdate = () => {
      // 비디오 트랙의 가시성 여부를 제어
      const videoTracks = stream instanceof MediaStreamTrack ? [stream] : stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !muted;
      });

      // 기존 오디오 트랙 가져오기
      const existingAudioTracks = mediaStream ? mediaStream.getAudioTracks() : [];

      // MediaStreamTrack의 인스턴스인 경우 처리
      if (stream instanceof MediaStreamTrack) {
        const newMediaStream = new MediaStream([stream, ...existingAudioTracks]);
        setMediaStream(newMediaStream);
      } else if (stream.getTracks) {
        // getTracks 메서드를 가진 stream-like 객체인 경우 처리
        const tracks = stream.getTracks();
        const videoTrack = tracks.find((track) => track.kind === "video");
        const newMediaStream = new MediaStream([videoTrack, ...existingAudioTracks]);
        setMediaStream(newMediaStream);
      } else {
        console.error("지원되지 않는 스트림 유형입니다:", stream);
      }
    };

    handleStreamUpdate(); // 최초 실행

    // 비디오 엘리먼트에 MediaStream 할당
    videoRef.current.srcObject = mediaStream;

    // stream이 변경될 때마다 handleStreamUpdate 함수 호출
  }, [stream, muted]);

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
