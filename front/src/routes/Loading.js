import { Audio } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Audio color="#C63DEE" height={15} width={5} radius={2} margin={2} />
    </div>
  );
};

export default Loading;
