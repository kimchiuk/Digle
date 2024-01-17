import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <>
      <h2>회원가입</h2>
      <hr />
      <div>
        <h4>회원가입 약관</h4>
        <textarea>내용</textarea>
      </div>
      <div>
        <label htmlFor="checkobox">라벨입니다.</label>
        <input type="checkbox" name="" id="checkobox" />
      </div>
      <Link to="detail">다음으로</Link>
    </>
  );
};

export default Signup;
