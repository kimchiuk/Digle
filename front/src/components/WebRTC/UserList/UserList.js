import React, { useState } from 'react';
import TextInputModal from '../Chatting/TextInputModal';

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
        alert(`${user.rfdisplay} 강퇴됩니다.`);
        kickParticipant(user.rfid); // 강퇴 함수 호출
    };

    const handleModalClose = () => setIsModalOpen(false);

    const handleModalSubmit = (message) => {
        if (selectedUser && message.trim()) {
            sendPrivateMessage(message, selectedUser.rfdisplay);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            {feeds.map((user) => (
                <div key={user.rfid} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '5px' }}>
                    <span onClick={() => handleUserClick(user)}>
                        {user.rfdisplay}
                    </span>
                    <button onClick={(e) => handleKickClick(user, e)} style={{ marginLeft: '10px' }}>
                        강퇴
                    </button>
                </div>
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
