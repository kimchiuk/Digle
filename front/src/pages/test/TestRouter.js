import React from 'react';
import { Link } from 'react-router-dom';
import video from '../../assets/webRTC/video.png'
import test from '../../assets/webRTC/test.png'

function TestRouter() {
  return (
    <div className="flex h-screen">
      {/* 왼쪽 페이지 */}
      <div className="w-1/2 bg-sky-100 flex items-center justify-center">
        <Link to="/create_room" className="text-2xl text-white">
          <
          img 
          src={video} 
          alt="비디오 로고"
          className='w-[240px]'
          />
        </Link>
        
      </div>
      {/* 오른쪽 페이지 */}
      <div className="w-1/2 bg-pink-100 flex items-center justify-center">
        <Link to="/TestTemp" className="text-2xl text-white">
        <
          img 
          src={test} 
          alt="시험 로고"
          className='w-[240px]'
          />
        </Link>
      </div>
    </div>
  );
}

export default TestRouter;