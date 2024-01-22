import { useState } from "react";

const SignupNormal = () => {
  const [image, setImage] = useState("");

  const onChangeImageUpload = (e) => {
    const { files } = e.target;
    const uploadFile = files[0];
    if (uploadFile && uploadFile instanceof Blob) {
      const reader = new FileReader();
      reader.readAsDataURL(uploadFile);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    } else {
      console.error("잘못된 파일 타입. Blob을 기대했습니다.");
    }
  };
  return (
    <>
      <div>
        <label htmlFor="imageUpload">Upload Image:</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={onChangeImageUpload}
        />
      </div>
    </>
  );
};

export default SignupNormal;
