import DaumPostcode from "react-daum-postcode";
import Modal from "react-modal";

const DaumPost = ({
  zipCode,
  roadAddress,
  detailAddress,
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
        <div className="flex justify-between">
          <div>
            <input
              className="border-b-2 pt-2"
              value={zipCode}
              readOnly
              placeholder="우편번호"
            />
          </div>
          <button className="" type="button" onClick={() => setIsOpen(true)}>
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
            <Modal isOpen={isOpen} ariaHideApp={false}>
              <div className="fixed inset-0 flex justify-center items-start pt-10">
                <div className="bg-white p-4 rounded-lg shadow-lg" style={{ width: '500px', height: '600px' }}>
                  <DaumPostcode onComplete={completeHandler} style={{ width: '100%', height: '100%' }} />
                </div>
              </div>
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
