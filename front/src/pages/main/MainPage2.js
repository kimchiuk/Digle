import img1 from '../../assets/face_recognition_crowd.jpg';

const Main2 = () => {
  return (
    <div className="flex justify-center items-center mx-16 my-4 h-[500px]">
      <div className="flex flex-wrap justify-center max-w-screen-l mx-auto">
        <div className="flex-1 mr-10 flex flex-col justify-center"> {/* 수정된 부분 */}
          <h1 className="text-2xl text-center font-extrabold">
            화상 얼굴 인식 기능
          </h1>
          <hr className="mx-7 my-4 bg-gray-500 h-0.5 border-1px" />
          <div className="text-center"> {/* 수정된 부분 */}
            <p className="text-lg font-medium pt-6 min-w-[220px]">
              얼굴 인식(Facial Recognition)은 컴퓨터 비전 및 인공 지능 기술을
              사용하여 사진 또는 비디오에서 얼굴을 탐지하고 인식하는 기술입니다.
              <br />
              화상 얼굴 인식은 주로 다음과 같은 기능을 수행합니다.
            </p>
          </div>
        </div>
        <div className="flex-1 ml-10 hidden md:block min-w-[320px] flex justify-center items-center">
          <img src={img1}/>
        </div>
      </div>
    </div>
  );
};

export default Main2;
