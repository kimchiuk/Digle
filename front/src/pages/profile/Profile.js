import { useState } from "react";

import ImageUpload from "../../components/ImageUpload";

const Profile = ({ id, name, email, phone }) => {
  //   const [changeName, setName] = useState(name);
  //   const [changeEmail, setEmail] = useState(email);
  //   const [changePhone, setPhone] = useState(phone);
  //   const [changeInfo, setChangeInfo] = useState(false);
  //   const changelick = () => {
  //     setChangeInfo((prevChangeInfo) => !prevChangeInfo);
  //   };

  // 프로필 사진 첨부

  return (
    <>
      <div className="pt-20 text-xl font-bold mb-2 ml-8">회원정보 수정</div>
      <hr className="mb-2 p-2 ml-8" />
      <div className="flex pl-10">
        {/* 프로필 사진 및 수정 */}
        <div>
          <ImageUpload />
        </div>
        {/* 회원정보 수정 form */}
        <div className="relative flex h-screen border-4 rounded-lg">
          <div className="pt-20 w-[800px] text-left px-5">
            <form className="flex flex-col p-2">
              <div className="flex flex-col">
                <label htmlFor="id">아이디</label>
                <input
                  className="border-b-2 rounded m-2 w-48"
                  id="id"
                  type="text"
                />
              </div>
              <div className="flex flex-col">
                <label className="" htmlFor="name">
                  이름
                </label>
                <input
                  className="border-b-2 rounded m-2 w-48"
                  type="text"
                  id="name"
                  value={name}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">이메일</label>
                <input
                  className="border-b-2 rounded m-2"
                  type="text"
                  id="email"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="phone">전화번호</label>
                <input
                  className="border-b-2 rounded m-2"
                  type="text"
                  id="phone"
                />
              </div>
              <div className="flex justify-between mt-8">
                <button className="bg-gray-500 text-white py-2 px-8 rounded cursor-pointer">
                  뒤로가기
                </button>
                <input
                  className="bg-blue-500 text-white py-2 px-8 rounded cursor-pointer mt-2"
                  type="submit"
                  //   value={changeIn0fo ? "수정하기" : "수정완료"}
                  //   onClick={changeClick}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
