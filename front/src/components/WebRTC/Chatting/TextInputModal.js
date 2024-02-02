import React, { useState } from 'react';

const TextInputModal = ({ onSubmit, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
    setMessage(''); // 메시지 전송 후 입력 필드 초기화
    onClose(); // 메시지 전송 후 모달 닫기
  };

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: '1000', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <form onSubmit={handleSubmit}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: '300px', height: '100px', marginBottom: '10px' }} />
        <br />
        <button type="submit">보내기</button>
        <button onClick={onClose} type="button">닫기</button>
      </form>
    </div>
  );
};

export default TextInputModal;
