import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <>
      <div className="w-96 h-96  align-middle ">
        <div className="pt-20 text-start ">
          <div className="p-2">회원가입</div>
          <div className="p-2">회원가입 약관</div>
          <div className="m-2 p-2 h-60 border-2">내용</div>

          <div className="p-2 text-right">
            <label className="" htmlFor="checkobox">
              동의합니다.
            </label>
            <input type="checkbox" name="" id="checkobox" />
          </div>
          <Link className=" text-end" to="detail">
            다음으로
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
