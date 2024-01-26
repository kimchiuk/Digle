import BusinessSignup from "./BusinessSignup";
import SignupNormal from "./SignupNormal";

const SelectSignup = ({
  isCompany,
  onButtonClick,
  image,
  readImage,
  onChangeImageUpload,
  setEnrollCompany,
  enrollCompany,
  zipCode,
  roadAddress,
  detailAddress,
  isOpen,
  setIsOpen,
  companyName,
  companyNameHandler,
  completeHandler,
  changeHandler,
  companyEmailHandler,
  companyEmail,
}) => {
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
            onClick={(e) => {
              e.preventDefault();
              onButtonClick(false);
            }}
          >
            개인 회원
          </button>
        </div>
        <div className="w-1/2 text-center">
          <button
            className={`py-2 px-4 ${
              isCompany ? "bg-blue-700" : "bg-blue-500"
            } text-white rounded-md hover:bg-blue-700`}
            onClick={(e) => {
              e.preventDefault();
              onButtonClick(true);
            }}
          >
            기업 회원
          </button>
        </div>
      </div>
      <div className="py-2">추가 정보 입력하기</div>
      <div>
        {!isCompany ? (
          <SignupNormal
            image={image}
            readImage={readImage}
            onChangeImageUpload={onChangeImageUpload}
          />
        ) : (
          <BusinessSignup
            setEnrollCompany={setEnrollCompany}
            enrollCompany={enrollCompany}
            zipCode={zipCode}
            roadAddress={roadAddress}
            detailAddress={detailAddress}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            companyName={companyName}
            companyNameHandler={companyNameHandler}
            completeHandler={completeHandler}
            changeHandler={changeHandler}
            companyEmailHandler={companyEmailHandler}
            companyEmail={companyEmail}
          />
        )}
      </div>
    </>
  );
};

export default SelectSignup;
