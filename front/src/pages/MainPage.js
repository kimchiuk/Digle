import MainImage from "../mainImage.jpg";

const Main = () => {
  return (
    <div className="h-[1000px]">
    <div className="relative w-full h-full overflow-hidden">
      <img
        className="object-cover w-full h-full"
        src={MainImage}
        alt="sun-flower"
      />
      <div className="absolute top-96 right-40 text-white bg-sky-950 opacity-70">
        <p className="text-2x1 font-bold">온라인 시험 신분증 검사,</p>
        <p className="text-xl">AI로 간편하게 비교하세요</p>
      </div>
    </div>
    </div>
  );
};

export default Main;