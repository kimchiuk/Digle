import { useState } from "react";
import { useNavigate } from "react-router-dom";

import GetInviteCode from "components/WebRTC/Chatting/GetInviteCode";

const TestChattingPage = () => {
  const videos = 30; // 유저 화면의 개수
  const videoBox = 1;

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);
  // 채팅창 모달 열기
  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  // 채팅창 모달 닫기
  const closeChatModal = () => {
    setIsChatModalOpen(false);
  };

  // 유저 리스트 모달 열기
  const openUserListModal = () => {
    setIsUserListModalOpen(true);
  };

  // 유저 리스트 모달 닫기
  const closeUserListModal = () => {
    setIsUserListModalOpen(false);
  };
  return (
    <>
      <div className="h-full w-full relative">
        <div className="border-2 h-20 flex justify-between">
          <div className="border-2 w-20 h-20">로고</div>
          <div className="border-2 w-40 h-20 flex">
            <div className="border-2 w-20 h-full"></div>
            <div className="border-2 w-20 h-full">화면 캡쳐</div>
          </div>
        </div>
        <div className="border-2 h-[700px] px-20 overflow-auto flex flex-wrap">
          {Array.from({ length: videos }).map((_, index) => (
            <div className="border-2 w-60 h-40 mb-4">유저 화면</div>
          ))}
        </div>
        <div className="border-2 h-20 flex justify-between">
          <div className="border-2 w-40 h-full flex relative">
            <div className="border-2 w-20 h-full relative">
              <div className="w-20 h-full" onClick={openChatModal}>
                채팅창 모달
              </div>
              {/* 채팅창 모달 */}
              {isChatModalOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-80 h-96 bg-white p-2 rounded border-2">
                  <div className="flex justify-between">
                    <div>채팅 모달 내용</div>
                    <button onClick={closeChatModal}>X</button>
                  </div>
                </div>
              )}
            </div>
            <div className="border-2 w-20 flex justify-center items-center">
              <GetInviteCode />
            </div>
          </div>
          <div className="border-2 w-20 h-full relative">
            <div className="w-full" onClick={openUserListModal}>
              유저 리스트
            </div>
            {/* 유저 리스트 모달 */}
            {isUserListModalOpen && (
              <div className="absolute bottom-full mb-2 right-0 translate-x-[-80%] left-0 w-60 h-96 bg-white p-2 rounded border-2">
                <div className="flex justify-between">
                  <div>유저 리스트 모달 내용</div>
                  <button onClick={closeUserListModal}>X</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestChattingPage;
