import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <>
      <h2>회원가입</h2>
      <div>
        <h4>회원가입 약관</h4>
        <div>내용</div>
      </div>
      <div>
        <label htmlFor="checkobox">라벨입니다.</label>
        <input type="checkbox" name="" id="checkobox" />
      </div>
      <Link to="/signup/detail">다음으로</Link>
    </>
  );
};

export default Signup;
