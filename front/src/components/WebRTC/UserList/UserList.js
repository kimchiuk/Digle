import React, { useState } from 'react';
import UserListItem from './UserListItem/UserListItem';
import TextInputModal from '../Chatting/TextInputModal';

const UserList = ({ feeds, sendPrivateMessage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    console.log(user);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleModalSubmit = (message) => {
    if (selectedUser && message.trim()) {
      sendPrivateMessage(message, selectedUser.rfdisplay); // 여기서 `selectedUser.rfid`는 실제로 메시지를 보낼 대상의 ID를 나타냅니다.
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {feeds.map((feed) => (
        <UserListItem
          key={feed.rfid}
          user={feed}
          onClick={() => handleUserClick(feed)}
        />
      ))}
      {isModalOpen && (
        <TextInputModal
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};
 
export default UserList;
