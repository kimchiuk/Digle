import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <>
      <div className="w-96 align-middle h-full">
        <div className="pt-20 text-start">
          <div className="p-2">회원가입</div>
          <div className="p-2">이용 약관 정책</div>
          <div className="m-2 p-2 h-60 border-2">내용</div>

          <div className="p-2 text-right">
            <label className="" htmlFor="checkobox">
              동의합니다.
            </label>
            <input type="checkbox" name="" id="checkobox" />
          </div>
          <div className="p-2">개인 정보 수집</div>
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
