const SignupDetail = () => {
  return (
    <>
      <div>
        <h2>회원가입</h2>
        <form action="">
          <div>
            <label htmlFor="">아이디: </label>
            <input type="text" value="아이디를 입력하세요" />
          </div>
          <div>
            <label htmlFor="">비밀번호: </label>
            <input type="text" value="비밀번호를 입력하세요" />
          </div>
          <div>
            <label htmlFor="">비밀번호 확인: </label>
            <input type="text" value="비밀번호를 입력하세요" />
          </div>
          <div>
            <label htmlFor="">이메일: </label>
            <input type="text" value="이메일를 입력하세요" />
          </div>
          <input type="submit" value="회원가입 완료하기" />
        </form>
      </div>
    </>
  );
};

export default SignupDetail;
