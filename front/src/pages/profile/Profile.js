import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import ImageUpload from "../../components/ImageUpload";
import Loading from "../../routes/Loading";

const Profile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(null);

  // 초기 값
  const [image, setImage] = useState("");
  const [Email, setEmail] = useState("");
  const [name, setName] = useState("");

  // 프로필 변경 버튼 클릭 시
  const [changeEmail, setChangeEmail] = useState();
  const [changeName, setChangeName] = useState();

  // 프로필 변경 버튼 클릭 시 잠겨있는 블럭 해제
  const [updateButton, setUpdateButton] = useState(false);

  const API_URL = "https://localhost:8000";

  // useEffect(() => {
  //   setLoading(true)

  //   // useContext token 추가하기
  //   axios
  //     .get(`${API_URL}/profile`)
  //     .then((response) => {
  //       console.log(response);
  //       // 이 부분 값 확인 후 수정
  //       setEmail(response.data);
  //       setName(response.data);
  //       setLoading(false)
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  const imageHandler = (e) => {};

  const emailHandler = (e) => {
    const currentCode = e.target.value;
    setEmail(currentCode);
  };

  const nameHandler = (e) => {
    const currentCode = e.target.value;
    setName(currentCode);
  };

  const buttonClick = () => {
    setUpdateButton((pre) => !pre);
  };

  // 프로필 사진 첨부
  const profileUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);

    try {
      const response = await axios.put(`${API_URL}/profile`, formData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const backButton = () => {
    navigate("/");
  };

  return (
    <>
      <div className="pt-20 text-xl font-bold mb-2 ml-8">회원정보 수정</div>
      <hr className="mb-2 p-2 ml-8" />
      <div className="flex justify-center flex-wrap">
        {/* 프로필 사진 및 수정 */}
        <div>
          <ImageUpload />
        </div>
        {/* 회원정보 수정 form */}
        <div className="relative flex h-screen border-4 rounded-lg">
          <div className="pt-20 w-[600px] text-left px-5">
            <form onSubmit={profileUpdate} className="flex flex-col p-2">
              <div className="flex flex-col">
                <label htmlFor="email">이메일</label>
                {!updateButton ? (
                  <input
                    className="border-b-2 rounded m-2 bg-gray-100"
                    disabled
                    type="text"
                    id="email"
                    value={Email}
                  />
                ) : (
                  <input
                    className="border-b-2 rounded m-2 bg-white"
                    type="text"
                    id="email"
                    onChange={emailHandler}
                    value={Email}
                  />
                )}
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
                {!updateButton ? (
                  <input
                    className="border-b-2 rounded m-2 w-48"
                    type="text"
                    id="name"
                    value={name}
                    disabled
                  />
                ) : (
                  <input
                    className="border-b-2 rounded m-2 w-48"
                    type="text"
                    id="name"
                    value={name}
                    onChange={nameHandler}
                  />
                )}
              </div>
              <div className="flex justify-between mt-8">
                <button
                  className="bg-gray-500 text-white py-2 px-8 rounded cursor-pointer"
                  onClick={backButton}
                >
                  뒤로가기
                </button>
                {!updateButton ? (
                  <input
                    className="bg-blue-500 text-white py-2 px-8 rounded cursor-pointer mt-2"
                    type="button"
                    value="수정"
                    onClick={buttonClick}
                  />
                ) : (
                  <input
                    className="bg-blue-500 text-white py-2 px-8 rounded cursor-pointer mt-2"
                    type="submit"
                    value="제출하기"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* {loading && <Loading />} */}
    </>
  );
};

export default Profile;
