import DaumPostcode from "react-daum-postcode";

const DaumPost = (props) => {
  const complete = (data) => {
    let fullAddress = data.fullAddress;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    console.log(data);
    console.log(fullAddress);
    console.log(data.zonecode);

    props.setcompany({
      ...props.company,
      address: fullAddress,
    });
  };

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "20%",
    width: "400px",
    height: "400px",
    padding: "7px",
    zIndex: 100,
  };
  return (
    <div>
      <DaumPostcode className={postCodeStyle} autoClose onComplete={complete} />
    </div>
  );
};

export default DaumPost;
