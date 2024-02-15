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
      <button
        className="bg-gray-100 hover:bg-gray-300 flex border-2 rounded-lg w-[70px] h-8 justify-center items-center"
        onClick={getCode}
      >
        <img className="w-4 h-4" src={share} alt="공유 버튼" />
        <span className="ml-1 font-bold text-xs">링크</span>
      </button>
    </>
  );
};

export default GetInviteCode;
