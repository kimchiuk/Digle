import React from 'react';
import logo1 from '../../assets/icons/chat.png';
import logo2 from '../../assets/icons/face.png';
import logo3 from '../../assets/icons/monitor.png';
import logo4 from '../../assets/icons/megaphone.png';
import logo5 from '../../assets/icons/test.png';
import logo6 from '../../assets/icons/siren.png';

const items = [
  {
    title: '단일 가상 채팅 기능',
    content: '클러스트 기술을 이용한 대량 사용자 수용',
    image: logo1,
  },
  {
    title: '얼굴 인식 및 대조',
    content: 'AdaFace를 이용한 정확도 높은 얼굴 대조',
    image: logo2,
  },
  {
    title: '라이브 서비스',
    content: '설치가 필요 없는 웹(webRTC)',
    image: logo3,
  },
  {
    title: 'TTS 공지 기능',
    content: '텍스트를 음성으로 변환하여 공지하는 기능',
    image: logo4,
  },
  {
    title: '고품질 시험 서비스',
    content: '고해상도 및 안정적인 시험 서비스 제공',
    image: logo5,
  },
  {
    title: '자리 이탈 알림',
    content: '자리 이탈을 실시간으로 감지하고 알림을 제공',
    image: logo6,
  },
];

const Main3 = () => {
  return (
    <div className="flex flex-col items-center w-full h-auto">
      <div className="text-center items-center mb-8">
        <h1 className="text-4xl font-bold my-4 mt-[50px] mb-[30px] ">고객을 만족시키는 화상 서비스</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-screen-md mb-[80px] ml-0">
        {items.map((item, index) => (
          <div key={index} className="w-64 h-72 mx-[30px] mb-8 flex flex-col">
            <div className="w-40 h-40 m-auto mb-4 aspect-w-1 aspect-h-1 object-cover object-center border rounded-full bg-indigo-900">
              <img src={item.image} alt={`Logo ${index + 1}`} className="w-full h-full p-10" />
            </div>
            <div className="p-4 flex flex-col">
              <h1 className="text-xl text-center font-extrabold w-full mb-2">{item.title}</h1>
              <p className="text-center">{item.content}</p>
              {item.content === '설치가 필요 없는 웹(webRTC)' && <br />} {/* Add an extra line if content matches */}
            </div>
          </div>
        ))}
      </div>
      {/* Optional button or other components can go here */}
    </div>
  );
};

export default Main3;
