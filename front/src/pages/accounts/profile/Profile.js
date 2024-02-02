import { useEffect, useState } from "react";
import DeleteAccount from "../DeleteAccount";

import ImageUpload from "../../../components/ImageUpload";
import axios from "axios";
import DaumPost from "components/signup/DaumPost";

const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");

  // 일반 유저
  const [image, setImage] = useState(
    "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2018/png/iconmonstr-user-circle-thin.png&r=0&g=0&b=0"
  );
  const [isImage, setIsImage] = useState(false);
  const [readImage, setReadImage] = useState();

  // 비즈니스 유저
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  // daumPost에서 쓰이는 함수
  const [zipCode, setZipcode] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const completeHandler = (data) => {
    setZipcode(data.zonecode);
    setRoadAddress(data.roadAddress);
    setIsOpen(false); //추가
  };
  // 상세 주소검색 event
  const changeHandler = (e) => {
    setDetailAddress(e.target.value);
  };

  // 업데이트 버튼 ??
  const [isUpdate, setIsUpdate] = useState(false);

  const API_URL = "https://localhost:8000";

  useEffect(() => {
    // useContext token 추가하기
    axios
      .get(`${API_URL}/profile`, { withCredentials: true })
      .then((response) => {
        console.log(response);
        // 이메일과 이름 가져오기
        setEmail(response.data.email);
        setName(response.data.name);
        setUserType(response.data.user_type);

        // 일반 유저와 비즈니스 유저 데이터 정보 저장
        if (response.data.user_type === "Standard") {
          if (response.data.profile_picture_url != null) {
            const reader = new FileReader();
            reader.readAsDataURL(response.data.profile_picture_url[0]);
            reader.onloadend = () => {
              setImage(reader.result);
            };
          }
        } else if (response.data.user_type === "Business") {
          if (response.data.company_info != null) {
            setCompanyName(response.data.company_info);
          }
          if (response.data.company_email != null) {
            setCompanyEmail(response.data.company_email);
          }
          if (response.data.company_address != null) {
            const addressPattern = /^(.*?)\s\((\d{5})\)\s(.*)$/; // 우편번호, 도로명 주소, 상세 주소 추출을 위한 정규식 패턴
            const match = response.data.company_address.match(addressPattern);

            if (match) {
              setRoadAddress(match[1]); // 도로명 주소
              setZipcode(match[2]); // 우편번호
              setDetailAddress(match[3]); // 상세 주소
            }
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const updateButton = () => {
    setIsUpdate(true);
  };

  // 프로필 업데이트
  const profileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      // 일반 유저
      if (userType === "Standard") {
        if (isImage) {
          formData.append("profile_img", image);
        }
      } else if (userType === "Business") {
        setCompanyAddress(`${roadAddress} (${zipCode}) ${detailAddress}`);
        formData.append("company_info", companyName);
        formData.append("company_email", companyEmail);
        formData.append("company_address", companyAddress);
      }
      const response = await axios.put(`${API_URL}/profile`, formData, {
        withCredentials: true,
      });
      console.log(response);
      alert("프로필이 수정되었습니다.");
      setIsUpdate(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="pt-20 text-xl font-bold mb-2 ml-8">회원정보 수정</div>
      <hr className="mb-2 p-2 ml-8" />
      <div className="flex justify-center flex-wrap pb-8">
        {/* 회원정보 수정 form */}
        <div className="relative flex h-screen border-4 rounded-lg">
          <div className="pt-8 w-[600px] text-left px-5">
            <form onSubmit={profileUpdate} className="flex flex-col p-2">
              {userType === "Standard" ? (
                <div className="flex justify-center">
                  <ImageUpload
                    image={image}
                    setImage={setImage}
                    setIsImage={setIsImage}
                    setReadImage={setReadImage}
                    readImage={readImage}
                    name={name}
                  />
                </div>
              ) : null}
              {/* 프로필 사진 및 수정 */}
              <div className="flex flex-col">
                <label htmlFor="email">이메일</label>
                <input
                  className="border-b-2 rounded m-2 bg-gray-100"
                  disabled
                  type="text"
                  id="email"
                  value={email}
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

              {/* 비즈니스 유저만 보이는 태그 */}
              {userType === "Business" ? (
                <>
                  <div className="pt-2 flex flex-col">
                    <label className="" htmlFor="name">
                      회사이름
                    </label>
                    <input
                      className="border-b-2 rounded m-2 w-48"
                      type="text"
                      id="name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="pt-2 flex flex-col">
                    <label className="" htmlFor="name">
                      회사 이메일
                    </label>
                    <input
                      className="border-b-2 rounded m-2 w-48"
                      type="text"
                      id="name"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                    />
                  </div>
                  <div className="pt-2 flex flex-col">
                    <label className="" htmlFor="name">
                      회사 주소
                    </label>
                    <DaumPost
                      zipCode={zipCode}
                      roadAddress={roadAddress}
                      detailAddress={detailAddress}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      completeHandler={completeHandler}
                      changeHandler={changeHandler}
                    />
                  </div>
                </>
              ) : null}
              <div className="flex justify-between mt-8">
                <DeleteAccount />
                <input
                  className="bg-blue-500 text-white py-2 px-8 rounded cursor-pointer mt-2"
                  type="submit"
                  onClick={updateButton}
                  value="수정하기"
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
