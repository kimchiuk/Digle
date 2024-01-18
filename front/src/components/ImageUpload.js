import { useEffect, useState } from "react";

const ImageUpload = () => {
  const [uploadImgUrl, setUploadImgUrl] = useState();

  const onChangeImageUpload = (e) => {
    const { files } = e.target;
    const uploadFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadFile);
    reader.onloadend = () => {
      setUploadImgUrl(reader.result);
    };
  };
  return (
    <>
      <div className="flex flex-col pt-20">
        <img className="w-32 h-40" src={uploadImgUrl} alt="img" />
        <input type="file" accept="image/*" onChange={onChangeImageUpload} />
      </div>
    </>
  );
};

export default ImageUpload;
