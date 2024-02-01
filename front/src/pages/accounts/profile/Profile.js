import { useEffect, useState } from "react";
import DeleteAccount from "../DeleteAccount";

import ImageUpload from "../../../components/ImageUpload";
import axios from "axios";

const Profile = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const API_URL = "https://localhost:8000";

  useEffect(() => {
    // useContext token 추가하기
    axios
      .get(`${API_URL}/profile`)
      .then((response) => {
        console.log(response);
        setName();
        setImage();
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const updateButton = () => {
    setIsUpdate((pre) => !pre);
  };

  // 프로필 업데이트
  const profileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      const response = await axios.put(`${API_URL}/profile`, formData, {
        withCredentials: true,
      });
      console.log(response);
      alert("프로필이 수정되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="pt-20 text-xl font-bold mb-2 ml-8">회원정보 수정</div>
      <hr className="mb-2 p-2 ml-8" />
      <div className="flex justify-center flex-wrap">
        {/* 프로필 사진 및 수정 */}
        <div>
          <ImageUpload image={image} setImage={setImage} />
        </div>
        {/* 회원정보 수정 form */}
        <div className="relative flex h-screen border-4 rounded-lg">
          <div className="pt-20 w-[600px] text-left px-5">
            <form
              onSubmit={isUpdate ? profileUpdate : null}
              className="flex flex-col p-2"
            >
              <div className="flex flex-col">
                <label htmlFor="email">이메일</label>
                <input
                  className="border-b-2 rounded m-2 bg-gray-100"
                  disabled
                  type="text"
                  id="email"
                />
              </div>
              <div className="pt-4 flex flex-col">
                <input
                  className="border-2 w-40 h-10"
                  type="button"
                  value="비밀번호 변경"
                />
              </div>
              <div className="pt-2 flex flex-col">
                <label className="" htmlFor="name">
                  이름
                </label>
                <input
                  className="border-b-2 rounded m-2 w-48"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex justify-between mt-8">
                <DeleteAccount />
                <input
                  className="bg-blue-500 text-white py-2 px-8 rounded cursor-pointer mt-2"
                  type={isUpdate ? "button" : "submit"}
                  onClick={updateButton}
                  value={isUpdate ? "수정완료" : "수정하기"}
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
