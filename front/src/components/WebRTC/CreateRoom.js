// CreateRoom.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post("http://localhost:8000/rooms", {
        name: roomName,
        host_id: "host123",
      });
      console.log("Room created:", response.data);

      // 응답 데이터에서 roomId를 올바르게 추출합니다.
      const roomId = response.data.room_id;

      // 방이 성공적으로 생성되면 VideoChat.js로 이동
      navigate(`/vchat?roomId=${roomId}`);
    } catch (error) {
      console.error("방 생성 오류:", error);
    }
  };

  return (
    <div className="pt-[100px] w-32 h-20">
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="form-control w-full"
        placeholder="room_id"
      />
      <button onClick={handleCreateRoom}>방 만들기/방입장</button>
    </div>
  );
}

export default CreateRoom;
