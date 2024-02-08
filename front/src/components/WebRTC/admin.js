import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

function RoomList({ refresh }) {
  const [rooms, setRooms] = useState([]);
  const [participants, setParticipants] = useState({});
  const [showParticipants, setShowParticipants] = useState({}); // 각 방의 참여자 목록 표시 상태를 관리하는 상태

  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchRooms = useCallback(() => {
    axios
      .get(`${API_URL}/rooms/list`)
      .then((response) => {
        const fetchedRooms = response.data.plugindata.data.list;
        setRooms(fetchedRooms);

        // 초기화 시 모든 방에 대해 참여자 목록을 숨김 상태로 설정
        let initialShowState = {};
        fetchedRooms.forEach((room) => {
          initialShowState[room.room] = false;
        });
        setShowParticipants(initialShowState);
      })
      .catch((error) => {
        console.error("Error fetching rooms: ", error);
      });
  }, [API_URL]); // API_URL이 변경될 때만 함수가 새로 생성되도록 의존성 배열에 추가

  useEffect(() => {
    fetchRooms(); // 방 목록을 가져오는 함수를 호출
  }, [refresh, fetchRooms]); // refresh, fetchRooms가 변경될 때 effect가 실행되도록 의존성 배열에 추가

  const handleDeleteRoom = (room_id) => {
    axios
      .post(`${API_URL}/rooms/${room_id}/destroy`)
      .then(() => {
        const updatedRooms = rooms.filter((room) => room.room !== room_id);
        setRooms(updatedRooms);
      })
      .catch((error) => {
        console.error("Error deleting room: ", error);
      });
  };

  const handleShowParticipants = async (room_id) => {
    // 참여자 목록 표시 상태를 토글
    setShowParticipants((prevState) => ({
      ...prevState,
      [room_id]: !prevState[room_id],
    }));

    // 이미 참여자 목록을 가져온 상태라면 함수를 빠져나간다.
    if (participants[room_id]) return;

    try {
      const response = await axios.get(
        `${API_URL}/rooms/${room_id}/participants`
      );
      console.log(response);
      const fetchedParticipants = response.data;

      setParticipants((prevParticipants) => ({
        ...prevParticipants,
        [room_id]:
          fetchedParticipants.length > 0
            ? fetchedParticipants
            : "NoParticipants",
      }));
    } catch (error) {
      console.error("Error fetching participants: ", error);
    }
  };

  return (
    <div className="">
      <ul>
        {rooms.map((room) => (
          <li 
          className="bg-sky-300 text-white rounded-2xl p-3 mb-3"
          key={room.room}>
            {room.description}
            <button onClick={() => handleDeleteRoom(room.room)}>Delete</button>
            <button onClick={() => handleShowParticipants(room.room)}>
              {showParticipants[room.room] ? "참여자 숨기기" : "참여자 목록"}
            </button>
            {showParticipants[room.room] &&
              (Array.isArray(participants[room.room]) ? (
                <ul>
                  {participants[room.room].map((participant) => (
                    <li key={participant.id}>{participant.display}</li>
                  ))}
                </ul>
              ) : (
                <p>방에 아무도 존재하지 않습니다.</p>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;
