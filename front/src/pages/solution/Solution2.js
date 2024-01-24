import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Solution2 = () => {
  const [email, setEmail] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`질문이 성공적으로 제출되었습니다.`);

    navigate('/');
    // 여기에서 서버로 이메일, 질문 제목, 내용을 전송하는 로직을 추가해야 합니다.
  };

  return (
    <form onSubmit={handleSubmit} className="px-20 pt-16 pb-8 max-w-2xl mx-auto h-[640px] flex flex-col items-start">
      <h2 className="text-2xl font-bold mt-12 mb-6">FAQ</h2>

      <label htmlFor="questionTitle" className="block text-sm font-medium text-gray-700">
        질문 제목:
      </label>
      <input
        type="text"
        id="questionTitle"
        name="questionTitle"
        value={questionTitle}
        onChange={(e) => setQuestionTitle(e.target.value)}
        required
        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
      />

      <label htmlFor="questionContent" className="block text-sm font-medium text-gray-700 mt-4">
        질문 내용:
      </label>
      <textarea
        id="questionContent"
        name="questionContent"
        value={questionContent}
        onChange={(e) => setQuestionContent(e.target.value)}
        required
        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        rows="4"
      />

      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-4">
        이메일:
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
      />

      <button
        type="submit"
        className="mt-12 p-2 bg-blue-500 text-white rounded-md self-end"
      >
        질문 제출
      </button>
    </form>
  );
};

export default Solution2;
