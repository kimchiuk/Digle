import { useState } from "react";

const ImageUpload = () => {
  const [uploadImgUrl, setUploadImgUrl] = useState();

  const onChangeImageUpload = (e) => {
    const { files } = e.target;
    const uploadFile = files[0];
    if (uploadFile && uploadFile instanceof Blob) {
      const reader = new FileReader();
      reader.readAsDataURL(uploadFile);
      reader.onloadend = () => {
        setUploadImgUrl(reader.result);
      };
    } else {
      console.error("잘못된 파일 타입. Blob을 기대했습니다.");
    }
  };
  return (
    <>
      <div className="flex-col w-[250px] h-full p-4 mr-4 border-4">
        <div className="grid place-items-center">
          <img className="w-32 h-40" src={uploadImgUrl} alt="" />
        </div>
        <div className="grid place-content-end mt-2">
          <label
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            for="imgFile"
          >
            이미지 첨부
          </label>
        </div>
        <input
          className="hidden"
          type="file"
          name="imgFile"
          id="imgFile"
          accept="image/*"
          onChange={onChangeImageUpload}
        />
        <div className="grid place-items-center mt-4">
          <div>Name님 프로필</div>
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
