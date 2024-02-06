import { useState } from "react";

const TestChattingPage = () => {
  const videos = 20;
  const videoBox = 1;
  return (
    <>
      <div className="">
        <div className="border-2 h-20 flex justify-between">
          <div className="border-2 h-full w-32">로고</div>
          <div className="border-2 h-full w-32">화면 캡쳐</div>
        </div>
        <div className="border-2 h-[520px] px-20 overflow-auto flex flex-wrap">
          {Array.from({ length: videos }).map((_, index) => (
            <div className="border-2 w-60 h-40">유저 화면</div>
          ))}
        </div>
        <div className="border-2 h-20 flex justify-between">
          <div className="border-2 w-20">채팅창 모달</div>
          <div className="border-2 w-20">유저 리스트</div>
        </div>
      </div>
    </>
  );
};

export default TestChattingPage;
