import { useState } from "react";
import DaumPost from "./DaumPost";

const BusinessSignup = () => {
  const [enrollCompany, setEnrollCompany] = useState({
    address: "",
  });

  return (
    <>
      <div className="">
        <div className="flex flex-col">
          <label className="pt-2">회사 이름</label>
          <input
            className="pt-2 border-b-2"
            placeholder="회사 이름"
            type="text"
          />
        </div>
        <div className="pt-2">
          <DaumPost
            company={enrollCompany}
            setcompany={setEnrollCompany}
          ></DaumPost>
        </div>
      </div>
    </>
  );
};

export default BusinessSignup;
