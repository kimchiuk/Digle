import axios from "axios";

const RoomCreateButton = () => {
  const API_URL = "https://localhost:8000";

  const createRoom = (event) => {
    event.preventDefault();

    axios
      .post(`${API_URL}/create_room`, { withCreadentials: true })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <button onClick={createRoom}>버튼</button>
    </>
  );
};

export default RoomCreateButton;
