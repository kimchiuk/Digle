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

  return (
    <div>
      <DaumPostcode
        className="fixed, left-0, top-0 h-[100%] w-[100%]"
        autoClose
        onComplete={complete}
      />
    </div>
  );
};

export default DaumPost;
