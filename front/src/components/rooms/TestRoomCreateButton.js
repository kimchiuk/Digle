import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TestRoomCreateButton = ({ userName, userType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const createTestRoom = (event) => {
    event.preventDefault();
    if (userType === "Business") {
      axios
        .post(`${API_URL}/room/create_testroom`, null, {
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
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = (event) => {
    if (event.target.id === "modalBackdrop") {
      setIsModalOpen(false);
    }
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
