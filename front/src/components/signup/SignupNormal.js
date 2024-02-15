const SignupNormal = ({ image, onChangeImageUpload, readImage }) => {
  const defaultImagePath =
    "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2018/png/iconmonstr-user-circle-thin.png&r=0&g=0&b=0";

  return (
    <>
      <div className="flex justify-between">
        <div>
          <div className="w-40 center">
            <img
              src={readImage || defaultImagePath}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <input
            className="hidden"
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={onChangeImageUpload}
          />
          <div className="py-5">
            <label
              className="cursor-pointertext-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              htmlFor="imageUpload"
            >
              이미지 첨부
            </label>
          </div>
        </div>
        <div className="flex-col w-40">
          <div className="font-bold text-lg mb-2">프로필 사진 업로드</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            test 이용하는 회원은 반드시 사진정보를 입력해주시기 바랍니다.
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupNormal;
