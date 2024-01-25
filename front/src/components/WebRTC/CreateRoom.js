// CreateRoom.js
import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VideoChat from "./VideoChat"; // VideoChat 컴포넌트를 import

function CreateRoom() {
  const [room_id, setRoomId] = useState("");
  const navigate = useNavigate();
  const [roomList, setRoomList] = useState([]);

  const handleJoinRoom = async () => {
    try {
      // room_id가 비어 있는지 확인
      if (room_id.trim() === "") {
        console.error("방 이름을 입력하세요.");
        return;
      }

      // 방 입장
      const joinResponse = await axios.post(`http://localhost:8000/rooms/${room_id}/join`, null, {
        params: {
          user_id: "user123",
        },
      });

      const { user_id, role, janus_response } = joinResponse.data;
      const message = janus_response?.message;

      if (message && message.includes("Joined room") && message.includes(user_id)) {
        // 방 참여가 성공적으로 이루어지면 VideoChat.js로 이동
        navigate(`/vchat?roomId=${room_id}&userId=${user_id}&role=${role}`);
      } else {
        console.log(`Unexpected response message: ${message}`);
      }

    } catch (error) {
      console.error("방 참여 오류:", error);
      console.error("Error Response:", error.response);
    }
  };

  const fetchRoomList = async () => {
    try {
      const response = await axios.get("http://localhost:8000/rooms/list");
      console.log("Room list:", response.data);

      // 방 목록을 state에 업데이트
      setRoomList(response.data.rooms);
    } catch (error) {
      console.error("Error fetching room list:", error);
    }
  };

  const handleEnterRoom = (roomId) => {
    // 클릭한 방으로 입장하는 로직
    navigate(`/vchat?roomId=${roomId}`);
  };


  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 방 목록을 가져오기
    fetchRoomList();
  }, []); // 빈 배열을 전달하여 한 번만 호출되도록 함

  return (
    <div className="pt-[100px] w-32 h-20">
      <input
        type="text"
        value={room_id}
        onChange={(e) => setRoomId(e.target.value)}
        className="form-control w-full"
        placeholder="room_id"
      />
      <button onClick={handleJoinRoom}>방 입장</button>
      {room_id && <VideoChat roomId={room_id} />} {/* VideoChat 컴포넌트에 roomId를 전달 */}
    </div>
  );
}

export default CreateRoom;
