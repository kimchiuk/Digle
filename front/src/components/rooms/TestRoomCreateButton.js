import { useState } from "react";
import axios from "axios";

const TestRoomCreateButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState("");

  const API_URL = "https://localhost:8000";
  const createTestRoom = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("room_title", roomTitle);
    formData.append("room_type", "TestRoom");
    axios
      .post(`${API_URL}/create_testroom_request`, formData, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = (event) => {
    if (event.target.id === "modalBackdrop") {
      setIsModalOpen(false);
    }
  };

  const handleTitleChange = (event) => {
    setRoomTitle(event.target.value);
  };

  return (
    <>
      <button
        onClick={handleModalOpen}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        TEST
      </button>
      {isModalOpen && (
        <div
          id="modalBackdrop"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleModalClose}
        >
          <div className="bg-white p-5 rounded-md text-center">
            <input
              type="text"
              placeholder="방 제목을 입력하세요"
              value={roomTitle}
              onChange={handleTitleChange}
              className="text-center p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={createTestRoom}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              방 생성
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TestRoomCreateButton;
