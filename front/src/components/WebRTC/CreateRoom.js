import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RoomList from "./admin";
import reload from "../../assets/webRTC/refresh.png";

import MainImg from "../../assets/main.png";

function CreateRoom() {
  const [room_id, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [userName, setUserName] = useState(""); // State for storing user name
  const [userType, setUserType] = useState(""); // State for storing user type
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const handleJoinRoom = async () => {
    setIsLoading(true);
    try {
      // 방 만들기 API 호출
      const createResponse = await axios
        .post(`${API_URL}/rooms/create`, null, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("room_id : ", response.data.plugindata.data.room);
          const newRoomId = response.data.plugindata.data.room;
          setRoomId(newRoomId);

          const confirm = window.confirm(
            "방이 생성되었습니다. 바로 입장하시겠습니까?"
          );
          if (confirm) {
            navigate(`/anhs?roomId=${newRoomId}&userId=user123&role=publisher`);
          } else {
            setRefresh(!refresh);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("방 만들기 오류:", error);
    }
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setRefresh(!refresh); // refresh 상태를 변경
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 ">
      <img className="absolute w-full h-full object-cover" src={MainImg} />
      <div className="relative p-8 overflow-y-scroll overflow-y-hidden bg-white bg-opacity-70 rounded-2xl shadow-md max-w-sm w-full max-h-[400px] min-h-[300px] ">
        <div className="flex pb-5">
          <h1 className="font-bold">회의실 목록</h1>
          <button className="" onClick={handleRefresh}>
            <img className="w-4 h-4 ml-2" src={reload} alt="새로고침" />
          </button>
          <div className="flex items-end justify-end flex-grow">
        <button
          className="font-bold"
          onClick={handleJoinRoom}
          disabled={isLoading}
        >
          {isLoading ? "로딩 중" : "방 생성하기"}
        </button>
      </div>
        </div>
        <div className="flex flex-col space-y-6">
        </div>
        <RoomList refresh={refresh} />
      </div>
    </div>
  );
}

export default CreateRoom;
