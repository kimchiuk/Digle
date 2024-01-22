import { useState } from "react";
import DaumPost from "./DaumPost";

const BusinessSignup = () => {
  const [companyName, setCompanyName] = useState("");
  const [enrollCompany, setEnrollCompany] = useState({
    address: "",
  });
  const [popup, setPopup] = useState(false);

  const handleInput = (e) => {
    setEnrollCompany({
      ...enrollCompany,
      [e.target.name]: e.target.value,
    });
  };

  const handleComplete = (data) => {
    setPopup(!popup);
  };

  return (
    <>
      <div>
        <label for="">회사 이름</label>
        <input type="text" />
      </div>
      <div className="address_search">
        <label for="">주소</label>
        <input
          className="user_enroll_text"
          placeholder="주소"
          type="text"
          required={true}
          name="address"
          onChange={handleInput}
          value={enrollCompany.address}
        />
        <button onClick={handleComplete}>우편번호 찾기</button>
        {popup && (
          <DaumPost
            company={enrollCompany}
            setcompany={setEnrollCompany}
          ></DaumPost>
        )}
      </div>
    </>
  );
};

export default BusinessSignup;
