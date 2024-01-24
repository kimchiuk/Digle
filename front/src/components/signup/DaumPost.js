// import { useState } from "react";
// import DaumPostcode from "react-daum-postcode";

// const DaumPost = (props) => {
//   const complete = (data) => {
//     let fullAddress = data.address;
//     let extraAddress = "";

//     if (data.addressType === "R") {
//       if (data.bname !== "") {
//         extraAddress += data.bname;
//       }
//       if (data.buildingName !== "") {
//         extraAddress +=
//           extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
//       }
//       fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
//     }
//     console.log(data);

//     props.setcompany({
//       ...props.company,
//       address: fullAddress,
//     });
//   };

//   const postCodeStyle = {
//     display: "block",
//     position: "absolute",
//     top: "20%",
//     width: "400px",
//     height: "400px",
//     padding: "7px",
//     zIndex: 100,
//   };
//   return (
//     <div>
//       <DaumPostcode className={postCodeStyle} autoClose onComplete={complete} />
//     </div>
//   );
// };

// export default DaumPost;

import DaumPostcode from "react-daum-postcode";
import { useState, useRef, useEffect } from "react";
import Modal from "react-modal";

const DaumPost = () => {
  const [zipCode, setZipcode] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const completeHandler = (data) => {
    setZipcode(data.zonecode);
    setRoadAddress(data.roadAddress);
    setIsOpen(false); //추가
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    content: {
      left: "0",
      margin: "auto",
      width: "500px",
      height: "600px",
      padding: "0",
      overflow: "hidden",
    },
  };

  // 상세 주소검색 event
  const changeHandler = (e) => {
    setDetailAddress(e.target.value);
  };

  return (
    <>
      <div>
        <div className="flex justify-between">
          <div>
            <input
              className="border-b-2 pt-2"
              value={zipCode}
              readOnly
              placeholder="우편번호"
            />
          </div>
          <button className="" onClick={() => setIsOpen(true)}>
            우편번호 검색
          </button>
        </div>
        <input
          className="border-b-2 pt-2 w-full"
          value={roadAddress}
          readOnly
          placeholder="도로명 주소"
        />
        {isOpen && (
          <div onClick={() => setIsOpen(false)}>
            <Modal isOpen={isOpen} ariaHideApp={false} style={customStyles}>
              <DaumPostcode onComplete={completeHandler} height="100%" />
            </Modal>
          </div>
        )}
        <br />
        <input
          className="border-b-2 pt-2 w-full"
          type="text"
          onChange={changeHandler}
          value={detailAddress}
          placeholder="상세주소"
        />
      </div>
    </>
  );
};

export default DaumPost;
