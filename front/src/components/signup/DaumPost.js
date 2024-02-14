import DaumPostcode from "react-daum-postcode";
import Modal from "react-modal";

const DaumPost = ({
  zipCode,
  setZipcode,
  roadAddress,
  setRoadAddress,
  detailAddress,
  setDetailAddress,
  isOpen,
  setIsOpen,
  completeHandler,
  changeHandler,
}) => {
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
        <div className="flex justify-between mb-1">
          <div>
            <input
              className="border-b-2 pl-2 pt-2"
              value={zipCode}
              readOnly
              placeholder="우편번호"
            />
          </div>
          <button
            className="p-2 focus:outline-none text-white bg-sky-500 hover:bg-sky-400 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-sm"
            type="button"
            onClick={() => setIsOpen(true)}
          >
            우편번호 검색
          </button>
        </div>
        <input
          className="border-b-2 pt-2 pl-2 w-full mb-1"
          value={roadAddress}
          readOnly
          placeholder="도로명 주소"
        />
        {isOpen && (
          <div onClick={() => setIsOpen(false)}>
            <Modal isOpen={isOpen} ariaHideApp={false}>
              <div className="fixed inset-0 flex items-center justify-center">
                <div className="p-4 rounded-lg shadow-lg w-[500px] h-[400px] flex items-center justify-center">
                  <DaumPostcode onComplete={completeHandler} className="" />
                </div>
              </div>
            </Modal>
          </div>
        )}
        <br />
        <input
          className="border-b-2 pl-2 pt-2 w-full"
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
