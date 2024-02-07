import { useEffect, useState } from "react";
import DeleteAccount from "../DeleteAccount";

import ImageUpload from "../../../components/ImageUpload";
import axios from "axios";
import DaumPost from "components/signup/DaumPost";
// import { createRoot } from "react-dom/client";
// import { useNavigate } from "react-router-dom";

// const NewWindowContent = ({ onClose, email }) => {
//   const [step, setStep] = useState(1); // 현재 단계 관리
//   const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호
//   const [newPassword, setNewPassword] = useState(""); // 새 비밀번호
//   const [confirmPassword, setConfirmPassword] = useState(""); // 새 비밀번호 확인
//   const API_URL = "https://localhost:8000";
//   const verifyCurrentPassword = (e) => {
//     e.preventDefault();
//     // 현재 비밀번호를 백엔드로 전송하고 확인하는 로직 구현
//     const formData = new FormData();
//     formData.append("email", email);
//     formData.append("password", currentPassword);
//     axios
//       .post(`${API_URL}/change_password`, formData)
//       .then((res) => {
//         if (
//           res.data.message ===
//           "Authentication successful. Please reset your password."
//         ) {
//           // alert("변경할 비밀번호를 입력해주세요");
//           setStep(2);
//         }
//         console.log(res);
//         // 여기서는 확인이 성공했다고 가정하고 다음 단계로 넘어감
//       })
//       .catch((err) => {
//         console.log(err);
//         alert("비밀번호가 틀렸습니다.");
//       });
//   };

//   const changePassword = (e) => {
//     e.preventDefault();

//     const passwordRegExp =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
//     if (!passwordRegExp.test(newPassword)) {
//       alert("비밀번호 형식이 올바르지 않습니다.");
//     }
//     if (newPassword !== confirmPassword) {
//       alert("비밀번호가 일치하지 않습니다.");
//     }
//     // 새 비밀번호를 백엔드로 전송하는 로직 구현
//     const formData = new FormData();
//     formData.append("email", email);
//     formData.append("password", newPassword);
//     formData.append("confirm_password", confirmPassword);
//     axios
//       .post(`${API_URL}/reset_password`, formData)
//       .then((res) => {
//         console.log(res);
//         if (res.data.message === "Password reset successful.")
//           alert("비밀번호가 변경되었습니다. 로그아웃합니다.");
//         window.opener.postMessage("passwordChanged", origin);
//         window.close(); // 새 창 닫기
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     // 비밀번호 변경 성공 처리
//   };
//   return (
//     <div className="pt-4 flex flex-col">
//       {step === 1 && (
//         <div>
//           <input
//             className="border-2 w-40 h-10 mb-4"
//             type="password"
//             placeholder="현재 비밀번호"
//             value={currentPassword}
//             onChange={(e) => setCurrentPassword(e.target.value)}
//           />
//           <input
//             className="border-2 w-40 h-10"
//             type="button"
//             value="비밀번호 확인"
//             onClick={verifyCurrentPassword}
//           />
//         </div>
//       )}

//       {step === 2 && (
//         <div>
//           <input
//             className="border-2 w-40 h-10 mb-4"
//             type="password"
//             placeholder="새 비밀번호"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//           />
//           <input
//             className="border-2 w-40 h-10 mb-4"
//             type="password"
//             placeholder="새 비밀번호 확인"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//           <input
//             className="border-2 w-40 h-10"
//             type="button"
//             value="비밀번호 변경"
//             onClick={changePassword}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

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

  // const navigate = useNavigate();

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
            const base64Image = `data:image/jpeg;base64,${response.data.profile_picture_url}`;
            setReadImage(base64Image);
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

  // // 비밀번호 변경
  // const [newWindow, setNewWindow] = useState(null);
  // const [root, setRoot] = useState(null); // React 18 root 상태 추가

  // const openNewWindow = () => {
  //   // 새 창 열기
  //   const windowFeatures = "width=300, height=400, left=200, top=200";
  //   const nw = window.open("", "", windowFeatures);
  //   nw.document.title = "비밀번호 변경";

  //   // 새 창의 body에 div 컨테이너 생성
  //   const container = nw.document.createElement("div");
  //   nw.document.body.appendChild(container);

  //   const newRoot = createRoot(container); // React 18에서 createRoot 사용
  //   newRoot.render(
  //     <NewWindowContent onClose={() => nw.close()} email={email} />
  //   );

  //   nw.onbeforeunload = () => {
  //     newRoot.unmount(); // 창이 닫힐 때 언마운트 처리
  //     setNewWindow(null);
  //   };

  //   setNewWindow(nw);

  //   nw.focus();
  // };

  // useEffect(() => {
  //   // 여기서는 언마운트 로직을 더 이상 사용하지 않음
  //   return () => {
  //     if (newWindow) {
  //       newWindow.close();
  //     }
  //   };
  // }, [newWindow]);

  // useEffect(() => {
  //   const handleMessage = (event) => {
  //     // 동일 출처 정책 확인
  //     if (event.origin !== window.location.origin) {
  //       return;
  //     }

  //     if (event.data === "passwordChanged") {
  //       // 비밀번호 변경 성공 후 로그아웃 로직 및 리다이렉트 실행
  //       // 예: 쿠키 삭제 로직
  //       axios
  //         .post(`${API_URL}/logout`, { withCredentials: true })
  //         .then((res) => {
  //           if (res.data.message === "User logged out") {
  //             navigate("/login"); // 로그인 페이지로 리다이렉트
  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   };

  //   // 메시지 수신 이벤트 리스너 등록
  //   window.addEventListener("message", handleMessage);

  //   // 컴포넌트 언마운트 시 이벤트 리스너 제거
  //   return () => {
  //     window.removeEventListener("message", handleMessage);
  //   };
  // }, [navigate]); // navigate를 의존성 배열에 추가

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
                  // onClick={openNewWindow}
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
                <input
                  className="bg-blue-500 text-white py-2 px-8 rounded cursor-pointer mt-2"
                  type="submit"
                  onClick={updateButton}
                  value="수정하기"
                />
              </div>
            </form>
            <div className="flex-1 flex justify-end items-start">
              <DeleteAccount />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
