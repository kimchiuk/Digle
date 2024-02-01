import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import SelectSignup from "components/signup/SelectSignup";

const SignupDetail = () => {
  const navigate = useNavigate();

  // id, pwd, pwd2, name, email, address, phone
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  // input 태그 아래 메시지
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [confirmPasswordMsg, setConfirmPasswordMsg] = useState("");

  const [isEmail, setIsEmail] = useState(false);
  const [isPwd, setIsPwd] = useState(false);
  const [isConfirmPwd, setIsConfirmPwd] = useState(false);
  const API_URL = "https://localhost:8000";

  // API 만들어지면 axios 요청 보내서 로직 구현
  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [emailCodeOk, setEmailCodeOk] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeMsg, setEmailCodeMsg] = useState("");

  const [emailCheck, setEmailCheck] = useState(false);
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    // 폼 데이터에 담아서 전송

    if (!isEmail) {
      alert("이메일 형식을 지켜주세요!");
      return;
    }
    setEmailCheck(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      const response = await axios.post(
        `${API_URL}/request_verify_email`,
        formData
      );
      console.log(response);

      if (response.data) {
        // setEmailMessage("이미 가입된 이메일입니다.");
        // setEmailMessage("사용 가능한 이메일입니다.");
        setIsCheckEmail(true);
        setEmailCodeOk(false);
      } else {
        setEmailMessage("이미 가입된 이메일입니다.");
        setEmailCodeOk(true);
      }
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      alert("이미 가입된 이메일입니다.");
      setIsCheckEmail(false);
    }
    setEmailCheck(false);
  };

  // const handleEmailVerification = async () => {
  //   await handleCheckEmail();
  // };

  const emailCodeHandler = (e) => {
    const currentCode = e.target.value;
    setEmailCode(currentCode);
  };

  // 코드 인증 과정
  const handleCheckCode = async (e) => {
    e.preventDefault();
    // 폼 데이터에 담아서 전송
    const formData = new FormData();
    formData.append("email", email);
    formData.append("code", emailCode);
    try {
      const response = await axios.post(`${API_URL}/verify_email`, formData);
      if (response.status === 200) {
        console.log(response);
        setEmailCodeOk(true);
        alert("인증되었습니다.");
      } else {
        setEmailCodeOk(false);
      }
    } catch (error) {
      console.log("에러 내용", error);
    }
  };
  // const handleCodeVerification = async () => {
  //   await handleCheckCode();
  // };

  const emailHandler = (e) => {
    const currentEmail = e.target.value;
    setEmail(currentEmail);
    const emailRegExp =
      /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

    if (!emailRegExp.test(currentEmail)) {
      setEmailMessage("이메일의 형식이 올바르지 않습니다!");
      setIsEmail(false);
    } else {
      setEmailMessage("사용 가능한 이메일 입니다.");
      setIsEmail(true);
    }
  };

  const passwordHandler = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    const passwordRegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMsg(
        "대문자+소문자+숫자+특수문자 조합으로 8자리 이상 입력해주세요!"
      );
      setIsPwd(false);
    } else {
      setPasswordMsg("안전한 비밀번호입니다.");
      setIsPwd(true);
    }
  };
  const confirmPasswordHandler = (e) => {
    const currentConfirmPassword = e.target.value;
    setConfirmPassword(currentConfirmPassword);

    if (password !== currentConfirmPassword) {
      setConfirmPasswordMsg("비밀번호가 일치하지 않습니다.");
      setIsConfirmPwd(false);
    } else {
      setConfirmPasswordMsg("비밀번호가 일치합니다.");
      setIsConfirmPwd(true);
    }
  };

  const nameHandler = (e) => {
    setName(e.target.value);
  };

  // selectSignup 에서 쓰일 함수, 상태
  const [isCompany, setIsCompany] = useState(false);
  const handleButtonClick = (isCompanyButton) => {
    setIsCompany(isCompanyButton);
  };

  // signupNormal 에서 쓰일 함수, 상태
  const [image, setImage] = useState(
    "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2018/png/iconmonstr-user-circle-thin.png&r=0&g=0&b=0"
  );
  const [isImage, setIsImage] = useState(false);
  const [readImage, setReadImage] = useState();

  const onChangeImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setReadImage(reader.result);
      };
      console.log("선택된 파일:", image);
      console.log(event.target.files[0]);
      setIsImage(true);
    }
  };

  // businessSignup 쓰이는 상태, 함수
  const [enrollCompany, setEnrollCompany] = useState({
    address: "",
  });
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const companyNameHandler = (e) => {
    setCompanyName(e.target.value);
  };
  const companyEmailHandler = (e) => {
    setCompanyEmail(e.target.value);
  };

  // daumpost 에서 쓰이는 상태, 함수
  const [zipCode, setZipcode] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const completeHandler = (data) => {
    setZipcode(data.zonecode);
    setRoadAddress(data.roadAddress);
    setIsOpen(false); //추가
  };
  // 상세 주소검색 event
  const changeHandler = (e) => {
    setDetailAddress(e.target.value);
    // console.log(zipCode);
    // console.log(roadAddress);
    // console.log(detailAddress);
    // console.log(companyAddress);
  };

  // 폼 제출 시
  const onSubmitButton = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("password", password);
    if (isCompany) {
      const companyAddress = `${roadAddress} (${zipCode}) ${detailAddress}`;
      // 기업 회원을 선택했을 때
      formData.append("user_type", "Business");
      formData.append("company_info", companyName);
      formData.append("company_email", companyEmail);
      formData.append("company_address", companyAddress);
    } else {
      // 개인 회원을 선택했을 때
      if (isImage) {
        console.log(image);
        formData.append("profile_img", image);
      }
      formData.append("user_type", "Standard");
    }

    try {
      const response = await axios.post(`${API_URL}/regist`, formData);
      console.log(response);
      if (response.status === 200) {
        alert("회원가입이 완료되었습니다.");
        navigate("/login");
      } else {
        alert("뭔가 이상이 있습니다. ");
      }
    } catch (error) {
      console.log("에러 내용", error);
    }
  };

  return (
    <>
      <div className="relative flex">
        <div className="pt-20 w-[500px] text-left px-5 mx-auto ">
          <form onSubmit={onSubmitButton}>
            <div className="text-xl font-bold mb-2">회원가입</div>
            <hr className="mb-2" />
            <div className="flex flex-col">
              <div className="flex justify-between my-2">
                <label className="mt-1" htmlFor="email">
                  이메일
                </label>
                <button
                  className="py-1 px-3 bg-blue-500 rounded-lg text-white"
                  onClick={handleCheckEmail}
                  disabled={emailCheck}
                >
                  이메일 확인
                </button>
              </div>
              <input
                className="border-b-2 py-1 px-2"
                type="text"
                id="email"
                value={email}
                onChange={emailHandler}
              />
              <div
                className={
                  !isEmail ? "text-sm text-red-500" : "text-sm text-green-500"
                }
              >
                {emailMessage}
                <div>
                  {isCheckEmail && (
                    <div>
                      <input
                        className="border-b-2 py-1 px-2"
                        type="text"
                        value={emailCode}
                        onChange={emailCodeHandler}
                      />
                      <button onClick={handleCheckCode}>인증</button>
                      <div>{emailCodeMsg}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col my-2">
              <label className="mb-1" htmlFor="password">
                비밀번호
              </label>
              <input
                className="border-b-2 py-1 px-2"
                type="password"
                id="password"
                value={password}
                onChange={passwordHandler}
                placeholder="8~25자이내 대문자+소문자+특수문자+숫자의 조합"
              />
              <div
                className={
                  !isPwd ? "text-sm text-red-500" : "text-sm text-green-500"
                }
              >
                {passwordMsg}
              </div>
            </div>
            <div className="flex flex-col my-2">
              <label className="mb-1" htmlFor="confirmPwd">
                비밀번호 확인
              </label>
              <input
                className="border-b-2 py-1 px-2"
                type="password"
                id="confirmPwd"
                value={confirmPassword}
                onChange={confirmPasswordHandler}
                placeholder="위 비밀번호와 동일하게 입력해주세요"
              />
              <div
                className={
                  !isConfirmPwd
                    ? "text-sm text-red-500"
                    : "text-sm text-green-500"
                }
              >
                {confirmPasswordMsg}
              </div>
            </div>
            <div className="flex flex-col my-2">
              <label className="mb-1" htmlFor="name">
                이름
              </label>
              <input
                className="border-b-2 py-1 px-2"
                type="text"
                id="name"
                value={name}
                onChange={nameHandler}
              />
            </div>
            <SelectSignup
              isCompany={isCompany}
              onButtonClick={handleButtonClick}
              image={image}
              onChangeImageUpload={onChangeImageUpload}
              enrollCompany={enrollCompany}
              setEnrollCompany={setEnrollCompany}
              companyName={companyName}
              companyNameHandler={companyNameHandler}
              zipCode={zipCode}
              roadAddress={roadAddress}
              detailAddress={detailAddress}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              completeHandler={completeHandler}
              changeHandler={changeHandler}
              companyEmail={companyEmail}
              companyEmailHandler={companyEmailHandler}
              readImage={readImage}
            />
            <input
              className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer mt-2 w-full "
              type="submit"
              value="회원가입 완료하기"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupDetail;
