import React from "react";
import { Link } from "react-router-dom";
import Mailsubmit from "assets//backgrounds/mailsubmit.jpg";

const Solution2Submit = () => {
  return (
    <div className="px-20 h-[550px] pt-16 pb-4 max-w-2xl mx-auto flex flex-col items-center">
      <img src={Mailsubmit} className="w-auto h-[300px] mx-auto"></img>
      <h2 className="text-2xl font-semibold pt-2 pb-2 mt-4 mb-6 text-center">제출이 완료되었습니다.</h2>
      <Link to="/">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200 ease-in-out transform hover:-translate-y-1">
          홈으로 돌아가기 →
        </button>
      </Link>

    </div>
  )
}

export default Solution2Submit;
