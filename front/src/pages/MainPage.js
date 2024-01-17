const Main = () => {
  return (
    <div className="">
    <div className="relative w-full h-full overflow-hidden">  
      <img className="object-cover w-full h-[800px]" src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FVjBRv%2FbtqHMwKxFgG%2FNPAxkGgvDkXeszqVT7MFm0%2Fimg.jpg" />
      <div className="absolute top-96 right-40 text-white bg-black opacity-70">
        <p className="text-2x1 font-bold">온라인 시험 신분증 검사,</p>
        <p className="text-xl">AI로 간편하게 비교하세요</p>
      </div>
      <div className="absolute bottom-32 right-20 text-white bg-black opacity-70">
        {/* 새로운 페이지 만들어서 링크 */}
        <p className="text-2x1 font-bold"> 테스트 바로가기 </p>
        
      </div>
    </div>
    </div>
  );
};

export default Main;