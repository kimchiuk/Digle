import React, { useEffect, useState } from "react";
import axios from "axios";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [participants, setParticipants] = useState({});
  const [showParticipants, setShowParticipants] = useState({}); // 각 방의 참여자 목록 표시 상태를 관리하는 상태

  useEffect(() => {
    axios
      .get("https://localhost:8000/rooms/list")
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
  }, []);

  const handleDeleteRoom = (room_id) => {
    axios
      .post(`https://localhost:8000/rooms/${room_id}/destroy`)
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
        `https://localhost:8000/rooms/${room_id}/participants`
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
    <div>
      <h2>Room List</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.room}>
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
