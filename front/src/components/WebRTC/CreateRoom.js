import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRoom() {
  const [room_id, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
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
          console.log(response.data.plugindata.data.room);
          const newRoomId = response.data.plugindata.data.room;
          setRoomId(newRoomId);
          alert("방이 생성되었습니다");
          navigate(`/vchat?roomId=${newRoomId}&userId=user123&role=publisher`);
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
  };

  return (
    <div className="pt-[100px] w-32 h-20">
      {/* <input
        type="text"
        value={room_id}
        onChange={(e) => setRoomId(e.target.value)}
        className="form-control w-full"
        placeholder="room_id"
      /> */}
      <button onClick={handleJoinRoom}>방 만들고 입장</button>
    </div>
  );
}

export default CreateRoom;
