import React, { useState } from "react";
import chat from "../../../assets/webRTC/chat/chat.png";

const TextInputModal = ({ onSubmit, onClose }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
    setMessage(""); // 메시지 전송 후 입력 필드 초기화
    onClose(); // 메시지 전송 후 모달 닫기
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg z-1000 rounded-8 shadow">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <img className="w-8 h-8" src={chat} />
          <div className="font-bold text-sm text-gray-400">개인 메세지</div>
        </div>
        <textarea
          value={message}
          className="flex text-xs mt-2 p-2 border-2 focus:outline-none w-[300px] h-[100px] resize-none"
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <div className="flex justify-between">
          <button className="focus:outline-none text-white bg-sky-500 hover:bg-sky-400 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-sky-900">
            보내기
          </button>
          <button
            className='className="focus:outline-none text-white bg-red-500 hover:bg-red-400 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-red-900"'
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextInputModal;
