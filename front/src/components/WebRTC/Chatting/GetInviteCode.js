import { useState } from "react";
import axios from "axios";

const GetInviteCode = () => {
  const API_URL = "https://localhost:8000";
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
      <button onClick={getCode}>초대코드</button>
    </>
  );
};

export default GetInviteCode;
