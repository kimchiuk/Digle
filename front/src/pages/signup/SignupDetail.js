import { useState } from "react";
import axios from "axios";

import SelectSignup from "../../components/signup/SelectSignup";

const SignupDetail = () => {
  // id, pwd, pwd2, username, email, address, phone
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");

  // input 태그 아래 메시지
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [confirmPasswordMsg, setConfirmPasswordMsg] = useState("");

  const [isEmail, setIsEmail] = useState(false);
  const [isPwd, setIsPwd] = useState(false);
  const [isConfirmPwd, setIsConfirmPwd] = useState(false);
  const API_URL = "http://127.0.0.1:8000";

  const submitHandler = (e) => {
    e.preventDefault();
  };
  // handler

  // API 만들어지면 axios 요청 보내서 로직 구현
  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [emailCodeOk, setEmailCodeOk] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeMsg, setEmailCodeMsg] = useState("");

  const handleCheckEmail = async () => {
    // 폼 데이터에 담아서 전송
    const formData = new FormData();
    formData.append("email", email);

    try {
      const response = await axios.post(
        `${API_URL}/request_verify_email`,
        formData
      );
      console.log(response);

      if (response.data) {
        setEmailMessage("이미 가입된 이메일입니다.");
        setIsCheckEmail(true);
        setEmailCodeOk(false);
      } else {
        setEmailMessage("사용 가능한 이메일입니다.");
        setIsCheckEmail(false);
        setEmailCodeOk(true);
      }
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
    }
  };

  const emailCodeHandler = (e) => {
    const currentCode = e.target.value;
    setEmailCode(currentCode);
  };

  // 코드 인증 과정
  const handleCheckCode = async () => {
    // 폼 데이터에 담아서 전송
    const formData = new FormData();
    formData.append("email", email);
    formData.append("code", emailCode);
    try {
      const response = await axios.post(`${API_URL}/verify_email`, formData);
      if (response.status === 200) {
        setEmailCodeOk(true);
        setEmailCodeMsg("인증 되었습니다.");
      } else {
        setEmailCodeOk(false);
        setEmailCodeMsg("인증 코드가 틀렸습니다.");
      }
    } catch (error) {
      console.log("에러 내용", error);
    }
  };

  // const clickId = (e) => {};
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

  const nameHandler = (e) => {
    setUserName(e.target.value);
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

  const onChangeImageUpload = (e) => {
    const { files } = e.target;
    const uploadFile = files[0];
    if (uploadFile && uploadFile instanceof Blob) {
      const reader = new FileReader();
      reader.readAsDataURL(uploadFile);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    } else {
      console.error("잘못된 파일 타입. Blob을 기대했습니다.");
    }
  };

  // businessSignup 쓰이는 상태, 함수
  const [enrollCompany, setEnrollCompany] = useState({
    address: "",
  });

  return (
    <>
      <div className="relative flex">
        <div className="pt-20 w-[500px] text-left px-5 mx-auto ">
          <form onSubmit={submitHandler}>
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
                value={userName}
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
