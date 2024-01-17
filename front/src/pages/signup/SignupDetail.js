import { useState } from "react";
// import axios from "axios";

const SignupDetail = () => {
  // id, pwd, pwd2, username, email, address, phone
  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // input 태그 밑 메시지
  const [idMsg, setIdMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [confirmPasswordMsg, setConfirmPasswordMsg] = useState("");

  // handler 7가지
  const idHandler = (e) => {
    setIdentification(e.target.value);
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };
  const confirmPasswordHandler = (e) => {
    setConfirmPassword(e.target.value);
  };
  const nameHandler = (e) => {
    setUserName(e.target.value);
  };
  const emailHandler = (e) => {
    setEmail(e.target.value);
  };
  const addressHandler = (e) => {
    setAddress(e.target.value);
  };
  const phoneNumberHandler = (e) => {
    setPhoneNumber(e.target.value);
  };

  // id 유효성검사 (중복유무)
  // const checkId = async () => {
  //   try {
  //     const response = await axios.post("#", {
  //       identification,
  //     });

  //     const result = response.data;

  //     if (result.isDuplicate) {
  //       setIdMsg("이미 사용중인 아이디입니다.");
  //     } else {
  //       setIdMsg("사용 가능한 아이디입니다.");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // password 유효성검사 ( #자 이상, 영문, 숫자, 특수문자 중 2가지 이상의 조합)
  const checkPwd = () => {
    if (password === confirmPassword) {
      setConfirmPasswordMsg("비밀번호가 일치합니다.");
    } else {
      setConfirmPasswordMsg("비밀번호가 일치하지 않습니다. ");
    }
  };

  // email 유효성검사 (중복 유무)

  return (
    <>
      <div>
        <div className="pt-20">
          <h2>회원가입</h2>
          <hr />
          <form onSubmit="#">
            <div>
              <label htmlFor="id">아이디 </label>
              <input
                type="text"
                id="id"
                value={identification}
                onChange={idHandler}
              />
              <button>중복검사</button>
              <div>{idMsg}</div>
            </div>
            <div>
              <label htmlFor="password">비밀번호 </label>
              <input
                type="text"
                id="password"
                value={password}
                onChange={passwordHandler}
              />
              <div>{passwordMsg}</div>
            </div>
            <div>
              <label htmlFor="confirmPwd">비밀번호 확인 </label>
              <input
                type="text"
                id="confirmPwd"
                value={confirmPassword}
                onChange={confirmPasswordHandler}
              />
              <div>{confirmPasswordMsg}</div>
            </div>
            <div>
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={nameHandler}
              />
            </div>
            <div>
              <label htmlFor="email">이메일</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={emailHandler}
              />
            </div>
            <div>
              <label htmlFor="address">주소</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={addressHandler}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber">휴대폰 번호</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={phoneNumberHandler}
              />
            </div>

            <input type="submit" value="회원가입 완료하기" />
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupDetail;
