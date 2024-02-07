import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import MainImg from "../../assets/main.png";

function CreateRoom() {
  const [room_id, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    setIsLoading(true);
    try {
      //   // room_id가 비어 있는지 확인
      //   if (room_id.trim() === "") {
      //     alert("방 번호를 입력하세요.");
      //     return;
      //   }
      //   console.log(room_id);

      // 방 만들기 API 호출
      const createResponse = await axios
        .post(
          `https://localhost:8000/rooms/create`,
          null, // 요청 바디가 없음을 나타냄
          // {
          //   params: {
          //     room_id: room_id,
          //   },
          // },
          { withCredentials: true }
        )
        .then((response) => {
          console.log("room_id : ", response.data.plugindata.data.room);
          const newRoomId = response.data.plugindata.data.room;
          setRoomId(newRoomId);
          alert("방이 생성되었습니다");
          navigate(`/anhs?roomId=${newRoomId}&userId=user123&role=publisher`);
        })
        .catch((err) => {
          console.log(err);
        });
      // 방 만들기가 성공적으로 이루어진 경우에만 VideoChat.js로 이동
      // if (createResponse.data.plugindata.data.videoroom === "created") {
      //   alert("방이 생성되었습니다");
      //   navigate(`/vchat?roomId=${room_id}&userId=user123&role=publisher`);
      // } else {
      //   alert("기존 방으로 이동됩니다");
      //   navigate(`/vchat?roomId=${room_id}&userId=user123&role=publisher`);
      // }
    } catch (error) {
      console.error("방 만들기 오류:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <img className="absolute w-full h-full object-cover" src={MainImg} />
      <div className="relative p-8 bg-black bg-opacity-70 rounded shadow-md max-w-sm w-full">
        <div className="flex flex-col space-y-6">
          {/* <input
        type="text"
        value={room_id}
        onChange={(e) => setRoomId(e.target.value)}
        className="form-control w-full"
        placeholder="room_id"
      /> */}
          <button
            className="text-white"
            onClick={handleJoinRoom}
            disabled={isLoading}
          >
            {isLoading ? "로딩 중" : "방 만들고 입장"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
