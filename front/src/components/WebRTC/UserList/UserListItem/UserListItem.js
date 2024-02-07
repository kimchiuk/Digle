import React from 'react';

const UserListItem = ({ user, onClick, kickParticipant }) => {

  const handleUserClick = () => {
    onClick(user);
  };

  const handleKickClick = (e) => {
    e.stopPropagation(); 
    alert(user.rfid);
    kickParticipant(user.rfid);
  };

  return (
    <div style={{ cursor: 'pointer' }}>
      <span onClick={handleUserClick}>
        {user.rfdisplay} {/* `user.rfdisplay`를 사용하여 사용자 이름 또는 별명을 표시 */}
      </span>
      <button onClick={handleKickClick} style={{ marginLeft: '10px' }}>
        강퇴
      </button>
    </div>
  );
};

export default UserListItem;
