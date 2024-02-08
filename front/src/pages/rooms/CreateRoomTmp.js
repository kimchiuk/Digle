import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainImg from "../../assets/main.png";
import RoomCreateButton from "components/rooms/RoomCreateButton";
import TestRoomCreateButton from "components/rooms/TestRoomCreateButton";
import axios from "axios";

const CreateRoomTmp = () => {
  const [userName, setUserName] = useState();
  const [userType, setUserType] = useState();
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/get_user_name_and_type`, { withCredentials: true })
      .then((res) => {
        console.log(res);
        console.log(res.data.user_name);
        const newUserName = res.data.user_name;
        setUserName(newUserName);
        console.log(res.data.user_type);
        const newUserType = res.data.user_type;
        setUserType(newUserType);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (userType === "Business") {
      await axios
        .post(`${API_URL}/rooms/create_test_room`, null, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          const newRoomId = response.data.plugindata.data.room;
          alert("방이 생성되었습니다");
          navigate(
            `/test_chatting_page?roomId=${newRoomId}&userId=${userName}&role=publisher`
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("일반 회원은 test 방을 생성할 수 없습니다.");
    }
    setIsLoading(false);
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <img className="absolute w-full h-full object-cover" src={MainImg} />
        <div className="relative p-8 bg-black bg-opacity-70 rounded shadow-md max-w-sm w-full">
          <div className="flex flex-col space-y-6">
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
    </>
  );
};

export default CreateRoomTmp;
