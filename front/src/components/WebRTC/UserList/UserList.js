import React, { useState } from "react";
import TextInputModal from "../Chatting/TextInputModal";

const UserList = ({ feeds, sendPrivateMessage, kickParticipant }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 사용자 클릭 핸들러
  const handleUserClick = (user) => {
    console.log(user);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // 강퇴 버튼 클릭 핸들러
  const handleKickClick = (user, e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 중지

    const isConfirmed = window.confirm(
      `${user.rfdisplay}님을 강퇴하시겠습니까?`
    );

    if (isConfirmed) {
      // 확인 버튼이 눌렸을 때 강퇴 함수 호출
      alert(`${user.rfdisplay}님이 강퇴되었습니다.`);
      kickParticipant(user.rfid);
    }
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleModalSubmit = (message) => {
    if (selectedUser && message.trim()) {
      sendPrivateMessage(message, selectedUser.rfdisplay); // 여기서 `selectedUser.rfid`는 실제로 메시지를 보낼 대상의 ID를 나타냅니다.
    }
    setIsModalOpen(false);
  };

  // feeds가 정의되지 않았거나 빈 배열일 경우에 대한 조건 추가
  if (!feeds || feeds.length === 0) {
    return <p className="text-xs">참가 인원이 없습니다.</p>;
  }

  return (
    <>
      {feeds.map((user) => (
        <div
          key={user.rfid}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "5px",
          }}
        >
          <span onClick={() => handleUserClick(user)}>{user.rfdisplay}</span>
          <button
            onClick={(e) => handleKickClick(user, e)}
            style={{ marginLeft: "10px" }}
          >
            강퇴
          </button>
        </div>
      ))}
      {isModalOpen && (
        <TextInputModal
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
          // kickParticipant={kickParticipant}
          // sendPrivateMessage={sendPrivateMessage}
        />
      )}
    </>
  );
};

export default UserList;
