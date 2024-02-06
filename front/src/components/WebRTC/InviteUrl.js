import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function InviteUrl() {
  const { inviteCode } = useParams(); // URL === 우리DB에 저장된 room_info(ivite_code)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await axios.get(`https://localhost:8000/join/${inviteCode}`);
        const room_id = extractRoomId(response); // 백엔드로부터 받은 방 ID
        navigate(`/vchat?roomId=${room_id}`);
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
