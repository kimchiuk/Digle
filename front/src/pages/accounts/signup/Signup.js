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
        <div className="m-2 p-2 h-60 border-2 overflow-y-auto">
          1. 서론
          <br /><br />
          본 이용약관은 [Digle]에서 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 [Digle]의 권리, 의무, 책임사항 등 기본적인 사항을 규정함을 목적으로 합니다.
          <br /><br />
          2. 서비스 이용 계약의 성립
          <br /><br />
          서비스 이용 계약은 이용자가 본 약관의 내용에 동의하고, 회원가입 양식에 따라 회원정보를 기입하여 회원가입을 신청한 후 [Digle]이 이를 승낙함으로써 체결됩니다.
          이용자가 온라인 가입신청 양식에 기재하는 모든 정보는 실제 데이터인 것으로 간주합니다.
          <br /><br />
          3. 서비스 제공 및 변경
          <br /><br />
          [Digle]은 지속적이고 안정적인 서비스 제공을 위해 노력합니다.
          서비스의 내용이 변경되거나 종료될 경우 [Digle]은 이용자에게 알려야 할 의무가 있으며, 이는 공지사항 등을 통해 이루어집니다.
          <br /><br />
          4. 이용자의 의무
          <br /><br />
          이용자는 개인정보 보호를 위해 자신의 계정 정보를 적절히 관리해야 합니다.
          이용자는 [Digle]의 서비스를 법적인 목적으로만 사용해야 합니다.
          <br /><br />
          5. 계약 해지 및 이용 제한
          <br /><br />
          이용자가 서비스 이용 계약을 해지하고자 할 때는 언제든지 회원탈퇴를 요청할 수 있습니다.
          [Digle]은 이용자가 본 약관에서 규정하는 사항을 위반하는 경우 서비스 이용을 제한할 수 있습니다.
          <br />
        </div>

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
        <div className="m-2 p-2 h-60 border-2 overflow-y-auto">
          1. 개인정보의 수집
          <br /><br />
          [Digle]은 회원가입, 서비스 신청 등을 위해 이용자의 개인정보를 수집할 수 있습니다.
          수집하는 개인정보의 항목은 이름, 이메일 주소, 연락처 등이 있습니다.
          <br /><br />
          2. 개인정보의 이용 목적
          <br /><br />
          수집된 개인정보는 서비스 제공, 고객 문의 응대, 신규 서비스 안내 등의 목적으로만 사용됩니다.
          <br /><br />
          3. 개인정보의 보유 및 이용 기간
          <br /><br />
          [Digle]은 이용자의 개인정보를 서비스 제공 기간 동안에만 보유하며, 이용 목적이 달성된 후에는 해당 정보를 즉시 파기합니다.
          <br /><br />
          4. 개인정보의 제3자 제공
          <br /><br />
          [Digle]은 법적인 요구가 있는 경우를 제외하고는 어떠한 경우에도 이용자의 개인정보를 제3자에게 제공하지 않습니다.
          <br />
        </div>
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
