import { useState } from "react";
import axios from "axios";

import share from "../../../assets/webRTC/share.png";

const GetInviteCode = () => {
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const userUrl = window.location.href;
  const urlObj = new URL(userUrl);
  const params = new URLSearchParams(urlObj.search);
  const roomId = params.get("roomId");

  const getCode = (event) => {
    event.preventDefault();

    axios
      .get(`${API_URL}/get_invite_code/${roomId}`)
      .then((response) => {
        const inviteCode = response.data.invite_code;
        console.log(inviteCode);

        if (navigator.clipboard) {
          navigator.clipboard
            .writeText(inviteCode)
            .then(() => {
              alert("초대 코드가 클립보드에 복사되었습니다.");
            })
            .catch((err) => {
              console.log("클립보드 복사 실패:", err);
            });
        } else {
          console.log("클립보드 API를 사용할 수 없습니다.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <button onClick={getCode}>
        <img className="w-5 h-5" src={share} alt="공유 버튼" />
      </button>
    </>
  );
};

export default GetInviteCode;
