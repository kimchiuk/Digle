const Main2 = () => {
  return (
    <div className="flex justify-center mx-16 my-4  ">
      <div className="flex flex-wrap justify-center max-w-screen-md mx-auto">
        <div className="flex-1 mr-10">
          <h1 className="text-2xl text-center font-extrabold">
            화상 얼굴 인식 기능
          </h1>
          <hr className="mx-7 my-4 bg-gray-500 h-0.5 border-none" />
          {/* <div className="border min-w-2.5"> */}
            <p className="text-lg font-bold pt-6 min-w-[220px]">
              얼굴 인식(Facial Recognition)은 컴퓨터 비전 및 인공 지능 기술을
              사용하여 사진 또는 비디오에서 얼굴을 탐지하고 인식하는 기술입니다.
              <br />
              화상 얼굴 인식은 주로 다음과 같은 기능을 수행합니다.
            </p>
          
          <div className="flex justify-center pt-12">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-xl text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 font-extrabold  "
            >
              확인했습니다!
            </button>
          </div>
          {/* </div> */}
        </div>
        <div className="flex-1 ml-10 hidden md:block min-w-[320px]">
          <img src="https://media.istockphoto.com/id/492571136/ko/%EC%82%AC%EC%A7%84/%EC%9B%B9-%ED%99%94%EC%83%81-%EC%B1%84%ED%8C%85%EC%97%90%EC%84%9C-%EC%9D%B8%EC%82%AC%ED%95%98%EB%8A%94-%EC%97%AC%EC%84%B1.jpg?s=612x612&w=is&k=20&c=Rh5N3eZctnDyETbRf-3yV0u2IAfihFcyX3iYtVoUE4c=" />
        </div>
      </div>
    </div>
  );
};

export default Main2;
