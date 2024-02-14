import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import deleteImg from "../../assets/webRTC/createroom/delete.png";
import userListOn from "../../assets/webRTC/createroom/userliston.png";
import userListOff from "../../assets/webRTC/createroom/userlistoff.png";

function RoomList({ refresh }) {
  const [rooms, setRooms] = useState([]);
  const [participants, setParticipants] = useState({});
  const [showParticipants, setShowParticipants] = useState({}); // 각 방의 참여자 목록 표시 상태를 관리하는 상태
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_user_name_and_type`, {
          withCredentials: true,
        });

        const newUserName = response.data.user_name;
        const newUserType = response.data.user_type;
        setUserName(newUserName);
        setUserType(newUserType);
      } catch (error) {
        console.error("유저 이름이 안가져와져요 에러:", error);
      }
    };

    fetchUserName();
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정

  const handleEnterRoom = (room_id) => {
    // navigate 함수를 사용하여 특정 경로로 이동
    navigate(`/anhs?roomId=${room_id}&userId=${userName}&role=publisher`);
  };

  const fetchRooms = useCallback(() => {
    axios
      // .get(`${API_URL}/rooms/list`)
      .get(`${API_URL}/get_room`)
      .then((response) => {
        // const fetchedRooms = response.data.plugindata.data.list;
        const fetchedRooms = response.data;
        setRooms(fetchedRooms);

        // 초기화 시 모든 방에 대해 참여자 목록을 숨김 상태로 설정
        let initialShowState = {};
        fetchedRooms.forEach((room) => {
          initialShowState[room.room_num] = false;
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
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");

    if (confirmDelete) {
      axios
        .post(`${API_URL}/rooms/${room_id}/destroy`)
        .then(() => {
          const updatedRooms = rooms.filter(
            (room) => room.room_num !== room_id
          );
          setRooms(updatedRooms);
        })
        .catch((error) => {
          console.error("Error deleting room: ", error);
        });
    }
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
    <div>
      <ul>
        {rooms.map((room) => (
          <li
            className="text-white rounded-lg p-3 mb-3 bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300"
            key={room.room_num}
          >
            <div className="flex justify-between">
              <div
                className="font-bold cursor-pointer"
                onClick={() => handleEnterRoom(room.room_num)}
              >
                {room.room_num}
              </div>
              <div>
                {userType === "Business" && ( // 비지니스 유저인 경우에만 삭제 버튼을 보여줌
                  <button onClick={() => handleDeleteRoom(room.room_num)}>
                    <img
                      className="w-3 h-3 mr-1"
                      src={deleteImg}
                      alt="삭제모양"
                    />
                  </button>
                )}
                <button onClick={() => handleShowParticipants(room.room_num)}>
                  {showParticipants[room.room_num] ? (
                    <img className="w-3 h-3" src={userListOff} alt="" />
                  ) : (
                    <img className="w-3 h-3" src={userListOn} alt="" />
                  )}
                </button>
              </div>
            </div>
            {showParticipants[room.room_num] &&
              (Array.isArray(participants[room.room_num]) ? (
                <ul>
                  {participants[room.room_num].map((participant) => (
                    <li key={participant.id}>{participant.display}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs">방에 아무도 존재하지 않습니다.</p>
              ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;
