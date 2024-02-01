import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Solution2 = () => {
  const [email, setEmail] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const navigate = useNavigate();
  const API_URL = 'https://localhost:8000'; // 서버 주소

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('questionTitle', questionTitle);
      formData.append('questionContent', questionContent);

      const response = await axios.post(`${API_URL}/send_faq`, formData);

      if (response.status === 200) {
        alert('질문이 성공적으로 제출되었습니다.');
        navigate('/');
      } else {
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('질문 제출 중 오류 발생:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-20 pt-16 pb-8 w-[600px] mx-auto h-auto flex flex-col items-start">
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
