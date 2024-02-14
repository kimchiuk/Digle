import DaumPost from "./DaumPost";

const BusinessSignup = ({
  enrollCompany,
  setEnrollCompany,
  zipCode,
  roadAddress,
  detailAddress,
  isOpen,
  setIsOpen,
  completeHandler,
  changeHandler,
  companyName,
  companyNameHandler,
  companyEmail,
  companyEmailHandler,
}) => {
  return (
    <>
      <div>
        <div className="flex flex-col mb-1">
          <input
            value={companyName}
            onChange={companyNameHandler}
            className="pt-2 border-b-2 pl-2"
            placeholder="회사 이름"
            type="text"
          />
        </div>
        <div className="flex flex-col mb-1">
          <input
            value={companyEmail}
            onChange={companyEmailHandler}
            className="pt-2 border-b-2 pl-2"
            placeholder="회사 이메일"
            type="text"
          />
        </div>
        <div className="pt-2 mb-1">
          <DaumPost
            company={enrollCompany}
            setcompany={setEnrollCompany}
            zipCode={zipCode}
            roadAddress={roadAddress}
            detailAddress={detailAddress}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            completeHandler={completeHandler}
            changeHandler={changeHandler}
          ></DaumPost>
        </div>
      </div>
    </>
  );
};

export default BusinessSignup;
