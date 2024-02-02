const ImageUpload = ({
  setImage,
  image,
  setIsImage,
  setReadImage,
  readImage,
  name,
}) => {
  const onChangeImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setReadImage(reader.result);
      };
      console.log("선택된 파일:", image);
      console.log(event.target.files[0]);
      setIsImage(true);
    }
  };
  return (
    <>
      <div className="flex-col w-[250px] h-full p-4 mr-4 ">
        <div className="grid place-items-center">
          <img className="w-32 h-40" src={readImage} alt="" />
        </div>
        <div className="grid place-content-end mt-2">
          <label
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            htmlFor="imgFile"
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
          <div>{name}님 프로필</div>
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
