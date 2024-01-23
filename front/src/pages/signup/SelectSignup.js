import { useState } from "react";

import BusinessSignup from "../../components/signup/BusinessSignup";
import SignupNormal from "../../components/signup/SignupNormal";

const SelectSignup = () => {
  const [isCompany, setIsCompany] = useState(false);

  const buttonClick = (isCompanyButton) => {
    if (isCompanyButton !== isCompany) {
      setIsCompany(isCompanyButton);
    }
  };

  return (
    <>
      <div className="py-2 font-bold">회원 유형</div>
      <hr className="p-2" />
      <div className="flex w-full h-full flex-row flex-wrap">
        <div className="w-1/2 text-center">
          <button
            className={`py-2 px-4 ${
              isCompany ? "bg-red-500" : "bg-red-700"
            } text-white rounded-md hover:bg-red-700`}
            onClick={() => buttonClick(false)}
          >
            개인 회원
          </button>
        </div>
        <div className="w-1/2 text-center">
          <button
            className={`py-2 px-4 ${
              isCompany ? "bg-blue-700" : "bg-blue-500"
            } text-white rounded-md hover:bg-blue-700`}
            onClick={() => buttonClick(true)}
          >
            기업 회원
          </button>
        </div>
      </div>
      <div className="py-2">추가 정보 입력하기</div>
      <div>{!isCompany ? <SignupNormal /> : <BusinessSignup />}</div>
    </>
  );
};

export default SelectSignup;
