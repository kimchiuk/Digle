// CreateRoom.js
import React, { useState } from "react";
import axios from "axios";

function CreateRoom() {
  const [roomName, setRoomName] = useState("");

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post("http://localhost:8000/rooms", {
        name: roomName,
        host_id: "host123",
      });
      console.log("Room created:", response.data);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="mt-20 w-32 h-20">
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="w-full"
      />
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
}

export default CreateRoom;
