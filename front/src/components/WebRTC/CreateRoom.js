import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRoom() {
  const [room_id, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    try {
      // room_id가 비어 있는지 확인
      if (room_id.trim() === "") {
        alert("방 번호를 입력하세요.");
        return;
      }

      // 방 참여(join) 시도
      const joinResponse = await axios.post(
        `http://localhost:8000/rooms/${room_id}/join`,
        null,
        {
          params: {
            user_id: "user123", // 사용자 ID를 적절히 설정
          },
        }
      );

      console.log(joinResponse.data);

      const { user_id, role, janus_response } = joinResponse.data;
      const message = janus_response?.message;
      console.log(joinResponse.data);

      if (message && message.includes("Joined room") && message.includes(user_id)) {
        // 방 참여가 성공적으로 이루어지면 VideoChat.js로 이동
        navigate(`/vchat?roomId=${room_id}&userId=${user_id}&role=${role}`);
      } else {
        // 방이 존재하지 않으면 새로운 방 만들기 시도
        const createResponse = await axios.post(
          "http://localhost:8000/rooms",
          {
            room: {
              room_id: room_id,
            },
          }
        );

        const { created, user_id, role, janus_response } = createResponse.data;
        const createMessage = janus_response?.message;

        if (created && createMessage && createMessage.includes("Created room")) {
          // 방 만들기가 성공적으로 이루어지면 VideoChat.js로 이동
          navigate(`/vchat?roomId=${room_id}&userId=${user_id}&role=${role}`);
        } else {
          console.log(`Unexpected response message during join: ${message}`);
          console.log(`Unexpected response message during create: ${createMessage}`);
        }
      }
    } catch (error) {
      console.error("방 참여 또는 만들기 오류:", error);
    }
  };

  return (
    <div className="pt-[100px] w-32 h-20">
      <input
        type="text"
        value={room_id}
        onChange={(e) => setRoomId(e.target.value)}
        className="form-control w-full"
        placeholder="room_id"
      />
      <button onClick={handleJoinRoom}>방 만들고 입장</button>
    </div>
  );
}

export default CreateRoom;
