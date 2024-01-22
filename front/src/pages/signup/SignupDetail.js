import { useState } from "react";
// import axios from "axios";

import BusinessSignup from "../../components/signup/BusinessSignup";

const SignupDetail = () => {
  // id, pwd, pwd2, username, email, address, phone
  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // input 태그 밑 메시지
  const [idMsg, setIdMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [confirmPasswordMsg, setConfirmPasswordMsg] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");

  const [isId, setIsId] = useState(false);
  const [isPwd, setIsPwd] = useState(false);
  const [isConfirmPwd, setIsConfirmPwd] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();

    // 제출 이후 아이디 생성 로직
  };
  // handler
  const idHandler = (e) => {
    const currentId = e.target.value;
    setIdentification(currentId);

    const idRegExp = /^[a-zA-z0-9]{4,12}$/;

    if (!idRegExp.test(currentId)) {
      setIdMsg("4-12사이 대소문자 또는 숫자만 입력해 주세요!");
      setIsId(false);
    } else {
      setIdMsg("사용가능한 아이디입니다.");
      setIsId(true);
    }
  };

  // API 만들어지면 axios 요청 보내서 로직 구현
  // const clickId = (e) => {};

  const passwordHandler = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMsg("숫자+영문+특수문자 조합으로 8자리 이상 입력해주세요!");
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
  const nameHandler = (e) => {
    setUserName(e.target.value);
  };

  const phoneNumberHandler = (e) => {
    const currentPhoneNumber = e.target.value;
    setPhoneNumber(currentPhoneNumber);
    const phoneRegExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if (!phoneRegExp.test(currentPhoneNumber)) {
      setPhoneMessage("올바른 형식이 아닙니다.");
      setIsPhone(false);
    } else {
      setPhoneMessage("사용 가능한 번호입니다.");
      setIsPhone(true);
    }
  };
  // email 중복유무

  return (
    <>
      <div className="relative flex h-screen">
        <div className="pt-20 w-[500px] text-left px-5 mx-auto ">
          <form onSubmit={submitHandler}>
            <div className="text-xl font-bold mb-2">회원가입</div>
            <hr className="mb-2" />
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="id">
                아이디
              </label>
              <input
                className="flex items-center space-x-2 border"
                type="text"
                id="id"
                value={identification}
                onChange={idHandler}
              />
              <button className="bg-blue-500 text-white py-1 px-2 rounded mt-2">
                중복검사
              </button>
              <div
                className={
                  !isId ? "text-sm text-red-500" : "text-sm text-green-500"
                }
              >
                {idMsg}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="password">
                비밀번호{" "}
              </label>
              <input
                className="border py-1 px-2"
                type="password"
                id="password"
                value={password}
                onChange={passwordHandler}
              />
              <div
                className={
                  !isPwd ? "text-sm text-red-500" : "text-sm text-green-500"
                }
              >
                {passwordMsg}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="confirmPwd">
                비밀번호 확인{" "}
              </label>
              <input
                className="border py-1 px-2"
                type="password"
                id="confirmPwd"
                value={confirmPassword}
                onChange={confirmPasswordHandler}
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
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="name">
                이름
              </label>
              <input
                className="border py-1 px-2"
                type="text"
                id="name"
                value={userName}
                onChange={nameHandler}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="email">
                이메일
              </label>
              <input
                className="border py-1 px-2"
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
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="phoneNumber">
                휴대폰 번호
              </label>
              <input
                className="border py-1 px-2"
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={phoneNumberHandler}
              />
              <div
                className={
                  !isPhone ? "text-sm text-red-500" : "text-sm text-green-500"
                }
              >
                {phoneMessage}
              </div>
            </div>
            <div></div>
            <input
              className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer mt-2 w-full "
              type="submit"
              value="회원가입 완료하기"
            />
          </form>
          <BusinessSignup />
        </div>
      </div>
    </>
  );
};

export default SignupDetail;
