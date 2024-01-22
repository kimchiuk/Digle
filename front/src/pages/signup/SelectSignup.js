const SelectSignup = () => {
  return (
    <>
      <div className="flex w-full h-full pt-20 flex-row flex-wrap">
        <div className="w-1/2 text-center">
          <button className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-700">
            개인 회원
          </button>
        </div>
        <div className="w-1/2 text-center">
          <button className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            기업 회원
          </button>
        </div>
      </div>
    </>
  );
};

export default SelectSignup;
