import React, { useEffect, useState } from 'react';
import logo1 from '../../assets/chat.png';
import logo2 from '../../assets/face.png';
import logo3 from '../../assets/monitor.png';
import logo4 from '../../assets/megaphone.png';
import logo5 from '../../assets/test.png';
import logo6 from '../../assets/siren.png';

const items = [
  {
    title: '라이브 서비스 지원 1',
    content: '라이브 방송에 특화된 환경 1',
    image: logo1,
  },
  {
    title: '라이브 서비스 지원 2',
    content: '라이브 방송에 특화된 환경 2',
    image: logo2,
  },
  {
    title: '라이브 서비스 지원 3',
    content: '라이브 방송에 특화된 환경 3',
    image: logo3,
  },
  {
    title: '라이브 서비스 지원 4',
    content: '라이브 방송에 특화된 환경 4',
    image: logo4,
  },
  {
    title: '라이브 서비스 지원 5',
    content: '라이브 방송에 특화된 환경 5',
    image: logo5,
  },
  {
    title: '라이브 서비스 지원 6',
    content: '라이브 방송에 특화된 환경 6',
    image: logo6,
  },
];

const Main3 = () => {
  const [isNarrow, setIsNarrow] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`${ isNarrow ? 'flex flex-col items-center' : 'flex justify-center'} bg-cyan-600 w-full`}>
      {isNarrow ? (
        <>
          <h1 className="text-2xl text-center font-extrabold mb-4">갈아 엎을 예정 갈아 엎을 예정 갈아 엎을 예정 갈아 엎을 예정</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <div key={index} className="w-full mb-8">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <div className="w-full h-32 object-cover object-center border overflow-hidden">
                    <img src={item.image} alt={`Logo ${index + 1}`} className="w-full h-full py-5 px-10" />
                  </div>
                  <div className="p-4">
                    <h1 className="text-2xl text-center font-extrabold mb-2">{item.title}</h1>
                    <hr className="mx-auto my-2 bg-gray-500 h-0.5 border-none" />
                    <p className="text-center">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl text-center font-extrabold">갈아 엎을 예정 갈아 엎을 예정 갈아 엎을 예정 갈아 엎을 예정</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-screen-md">
            {items.map((item, index) => (
              <div key={index} className="w-48 mx-[30px] mb-8">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <div className="w-full h-32 object-cover object-center border overflow-hidden">
                    <img src={item.image} alt={`Logo ${index + 1}`} className="w-full h-full py-5 px-10" />
                  </div>
                  <div className="p-4">
                    <h1 className="text-2xl text-center font-extrabold mb-2">{item.title}</h1>
                    <hr className="mx-auto my-2 bg-gray-500 h-0.5 border-none" />
                    <p className="text-center">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Main3;
