import { Link } from "react-router-dom";
import Main2 from "./MainPage2";
import Main3 from "./MainPage3";
import MainImg from "../../assets/main.png"

const Main = () => {
  return (
    <div className="bg-slate-50">
      <div className="flex items-center justify-center h-screen">
      <img className="absolute w-full h-full object-cover " src={MainImg} />
        <div className="absolute inset-y-0 right-0 flex items-center justify-center w-full md:w-1/2 lg:w-1/3 px-4 md:px-8 lg:px-2 bg-black bg-opacity-70">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              온라인 시험 신분증 검사,
            </p>
            <p className="text-xl text-white">AI로 간편하게 비교하세요</p>
          </div>
        </div>
        <div className="absolute bottom-32 right-20 text-white bg-black opacity-70">
          {/* 새로운 페이지 만들어서 링크 */}
          <Link to="test_router">
            <p className="text-2x1 font-bold"> 화상채팅 및 테스트 바로가기 </p>
          </Link>
        </div>
      </div>
      <hr className="mx-16 my-4 bg-gray-300 h-0.5 border-none" />
      <Main2 />
      <hr className="mx-16 bg-gray-300 h-0.5 border-none" />
      <Main3 />
    </div>
  );
};

export default Main;
