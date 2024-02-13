import { useEffect } from "react";

import camera from "../../../assets/webRTC/chat/camera.png";

const CaptureButton = ({ feeds, setCaptureFrames, captureFrames }) => {
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const handleCaptureClick = () => {
    setCaptureFrames(true);
    alert("사용자 이미지를 수집하였습니다.");
  };

  useEffect(() => {
    if (captureFrames) {
      feeds.forEach(async (feed) => {
        console.log("시작합니다요 캡처", feed);
        const videoElement = document.querySelector(`#video-${feed.rfid}`);
        if (videoElement) {
          const canvas = document.createElement("canvas");
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

          // 캔버스에서 이미지 데이터를 Base64 문자열로 변환
          const imageData = canvas.toDataURL("image/jpeg");

          // Base64 인코딩된 문자열에서 실제 이미지 데이터만 추출합니다.
          const base64Response = await fetch(imageData);
          const blob = await base64Response.blob();

          // FormData 객체를 생성하고, 파일 데이터를 추가합니다.
          const formData = new FormData();
          formData.append("faces", blob, `${feed.rfdisplay}.jpeg`);

          // fetch API를 사용하여 백엔드로 전송합니다.
          fetch(`${API_URL}/faces`, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) =>
              console.log(`Data from server for ${feed.rfid}:`, data)
            )
            .catch((error) => console.error("Error:", error));
        }
      });
      setCaptureFrames(false); // 캡처 완료 후 상태 초기화
    }
  }, [captureFrames, feeds]);

  return (
    <>
      <button
        className="border-2 rounded-3xl w-[70px] h-8 flex justify-center items-center bg-gray-200"
        onClick={handleCaptureClick}
      >
        <img src={camera} alt="" className="w-5 h-5" />
        <span>캡처</span>
      </button>
    </>
  );
};

export default CaptureButton;
