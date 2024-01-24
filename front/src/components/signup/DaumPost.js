import DaumPostcode from "react-daum-postcode";
import { useState } from "react";
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
  // 상세 주소검색 event
  const changeHandler = (e) => {
    setDetailAddress(e.target.value);
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
