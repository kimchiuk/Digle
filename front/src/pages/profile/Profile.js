import { useState } from "react";

const Profile = ({ id, name, email, phone }) => {
  //   const [adName, setName] = useState(name);
  //   const [adEmail, setEmail] = useState(email);
  //   const [adPhone, setPhone] = useState(phone);
  //   const [changeInfo, setChangeInfo] = useState(false);
  //   const adClick = () => {
  //     setChangeInfo((prevChangeInfo) => !prevChangeInfo);
  //   };
  //   const onSubmit = () => {
  //     let isOk = confirm("수정하시겠습니까?");

  //     if (isOk) {
  //     }
  //   };

  return (
    <>
      <div className="relative flex h-screen">
        <div className="pt-20 w-[500px] text-left px-5">
          <form>
            <div className="text-xl font-bold mb-2">회원정보 수정</div>
            <hr className="mb-2" />
            <div className="flex flex-col">
              <label htmlFor="">아이디</label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">이름</label>
              <input type="text" value={name} />
            </div>
            <div>
              <label htmlFor="">이메일</label>
              <input type="text" />
            </div>
            <div>
              <label htmlFor="">전화번호</label>
              <input type="text" />
            </div>
            <input
              type="submit"
              //   value={changeInfo ? "수정하기" : "수정완료"}
              //   onClick={adClick}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
