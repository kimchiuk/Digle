import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function InviteUrl() {
  const { inviteCode } = useParams(); // URL === 우리DB에 저장된 room_info(ivite_code)
  const navigate = useNavigate();
  const [userName, setUserName] = useState();
  const API_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    axios
      .get(`${API_URL}/get_user_name_and_type`, { withCredentials: true })
      .then((res) => {
        const newUserName = res.data.user_name;
        setUserName(newUserName);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/join/${inviteCode}`);
        const room_id = extractRoomId(response); // 백엔드로부터 받은 방 ID
        navigate(`/anhs?roomId=${room_id}&userId=${userName}&role=publisher`);
      } catch (error) {
        console.error("Failed to get room info:", error);
        alert("Invalid invite URL or room does not exist.");
      }
    };

    fetchRoomInfo();
  }, [inviteCode, navigate]);
}

function extractRoomId(response) {
  const message = response.data.janus_response.message; // 'Json에서 추출
  const roomIdMatch = message.match(/Joined room (\d+)/);
  if (roomIdMatch && roomIdMatch.length > 1) {
    return roomIdMatch[1];
  } else {
    return null; //흠..ㅋ
  }
}

export default InviteUrl;
