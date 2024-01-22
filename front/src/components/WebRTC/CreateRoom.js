import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomList, setRoomList] = useState([]);
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
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="form-control w-full"
        placeholder="room_id"
      />
      <button onClick={handleCreateRoom}>방 만들기/방입장</button>

      {/* 방 목록 표시 */}
      <div>
        <h2>방 목록</h2>
        <ul>
          {roomList.map((room) => (
            <li key={room.room_id}>
              {room.name}
              <button onClick={() => handleEnterRoom(room.room_id, room.name)}>입장</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CreateRoom;
