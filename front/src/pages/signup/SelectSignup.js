import { useState } from "react";

import BusinessSignup from "../../components/signup/BusinessSignup";
import SignupNormal from "../../components/signup/SignupNormal";

const SelectSignup = () => {
  const [isCompany, setIsCompany] = useState(false);

  const buttonClick = () => {
    setIsCompany((prev) => !prev);
  };

  return (
    <>
      <div className="font-bold">회원 유형</div>
      <div className="flex w-full h-full flex-row flex-wrap">
        <div className="w-1/2 text-center">
          <button
            className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-700"
            onClick={buttonClick}
          >
            개인 회원
          </button>
        </div>
        <div className="w-1/2 text-center">
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            onClick={buttonClick}
          >
            기업 회원
          </button>
        </div>
      </div>
      <div>{!isCompany ? <SignupNormal /> : <BusinessSignup />}</div>
    </>
  );
};

export default SelectSignup;
