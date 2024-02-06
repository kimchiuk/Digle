import React from 'react';

const UserListItem = ({ user, onClick }) => {
  // `user` prop에서 필요한 정보(예: 사용자 이름)를 추출하여 사용
  return (
    <div className="cursor-pointer" onClick={() => onClick(user)} >
      {user.rfdisplay} {/* `user.rfdisplay`를 사용하여 사용자 이름 또는 별명을 표시 */}
    </div>
  );
};

export default UserListItem;
