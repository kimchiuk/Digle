import React from 'react';

const Login = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">로그인</h3>
          {/* 로그인 폼 입력 필드 */}
          <h1>로그인 모달창</h1>
          <span className="top-0 right-0 absolute p-4">
            <button onClick={onClose}>&times;</button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;