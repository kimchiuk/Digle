const Main = () => {
  return (
    <div>
      <div className="h-[500px]">
        <div className="relative w-full h-full overflow-hidden">
          <img className="object-cover w-full h-full" src="#" alt="#" />
          <div className="absolute bottom-20 w-72 h-20  text-white lg:bottom-40 md:bottom-5 left-40 bg-sky-950 opacity-70 z-10">
            <p className="text-2x1 lg:text-4xl font-bold">
              온라인 시험 신분증 검사,
            </p>
            <p className="text-xl lg:text-2xl">AI로 간편하게 비교하세요</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
