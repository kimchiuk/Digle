import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  // navigate를 사용하기 위한 변수
  const navigate = useNavigate();

  // 약관 동의, 개인정보 제공 동의
  const [agreement, setAgreement] = useState(false);
  const [personalInfoAgree, setPersonalInfoAgree] = useState(false);

  // click 핸들러 두개
  const agreementHandler = (e) => {
    setAgreement((prevAgreement) => !prevAgreement);
  };
  const personalInfoAgreeHandler = () => {
    setPersonalInfoAgree((prevPersonalInfoAgree) => !prevPersonalInfoAgree);
  };

  // 두개의 동의가 모두 체크되어있을 때 다음으로 가는 로직
  const nextBtnClick = () => {
    if (agreement && personalInfoAgree) {
      navigate("detail");
    } else {
      alert("약관 동의를 하지 않으시면 서비스를 이용하실 수 없습니다.");
    }
  };
  return (
    <div className="center">
      <div className="w-96 mx-auto pt-20 text-left">
        <div className="p-2 text-2xl font-bold">회원가입</div>
        <div className="p-2">이용 약관 정책</div>
        <div className="m-2 p-2 h-60 border-2">내용</div>

        <div className="p-2 flex items-center justify-end">
          <label htmlFor="checkbox" className="mr-2">
            동의합니다.
          </label>
          <input
            type="checkbox"
            id="checkbox"
            onChange={agreementHandler}
            checked={agreement}
          />
        </div>
        <div className="p-2">개인 정보 수집</div>
        <div className="m-2 p-2 h-60 border-2">내용</div>
        <div className="p-2 flex items-center justify-end">
          <label htmlFor="checkbox2" className="mr-2">
            동의합니다.
          </label>
          <input
            type="checkbox"
            id="checkbox2"
            onChange={personalInfoAgreeHandler}
            checked={personalInfoAgree}
          />
        </div>
        <div className="flex justify-end">
          <button
            to="detail"
            className="block p-2 text-right mt-4 bg-sky-500 rounded-lg hover:bg-sky-700 text-white mb-3"
            onClick={nextBtnClick}
          >
            다음으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
