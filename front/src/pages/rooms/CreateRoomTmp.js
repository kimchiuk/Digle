import { useEffect, useState } from "react";

import RoomCreateButton from "components/rooms/RoomCreateButton";
import TestRoomCreateButton from "components/rooms/TestRoomCreateButton";
import axios from "axios";

const CreateRoomTmp = () => {
  const [userName, setUserName] = useState();
  const [userType, setUserType] = useState();
  const API_URL = "https://localhost:8000";

  useEffect(() => {
    axios
      .get(`${API_URL}/get_user_name_and_type`, { withCredentials: true })
      .then((res) => {
        console.log(res);
        console.log(res.data.user_name);
        const newUserName = res.data.user_name;
        setUserName(newUserName);
        console.log(res.data.user_type);
        const newUserType = res.data.user_type;
        setUserType(newUserType);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className="pt-20">
        <RoomCreateButton userName={userName} />
        <TestRoomCreateButton userName={userName} userType={userType} />
      </div>
    </>
  );
};

export default CreateRoomTmp;
