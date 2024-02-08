import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import Main2 from "./MainPage2";
import Main3 from "./MainPage3";
import MainImg from "../../assets/main.png";
import video from "../../assets/webRTC/video.png";
import test from "../../assets/webRTC/test.png";

const API_URL = process.env.REACT_APP_API_BASE_URL; // 서버 API 주소

const Main = () => {
  const [cookies] = useCookies(["isLogin"]);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    if (cookies.isLogin) {
      axios
        .get(`${API_URL}/get_user_name_and_type`, { withCredentials: true })
        .then((res) => {
          setUserType(res.data.user_type);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  }, [cookies.isLogin]);

  return (
    <div className="bg-slate-50">
      {/* 이미지 및 텍스트 코드는 동일하게 유지 */}
      <div className="flex items-center justify-center h-screen">
        <img
          className="absolute w-full h-full object-cover"
          src={MainImg}
          alt="Background"
        />
        <div className="absolute inset-y-0 right-0 flex items-center justify-center w-full md:w-1/2 lg:w-1/3 px-4 md:px-8 lg:px-2 bg-black bg-opacity-70">
          <div className="text-center">{/* 텍스트 내용 유지 */}</div>
          <div className="absolute bottom-10 right-4 text-md font-bold text-white opacity-70">
            <Link
              to={userType === "Business" ? "/create_test_room" : "/TestTemp"}
              className="flex items-center"
            >
              <img className="w-5 h-5 mr-2" src={test} alt="테스트 바로가기" />
              <p> 테스트 바로가기 </p>
            </Link>
            <Link to="/create_room" className="flex items-center">
              <img
                className="w-5 h-5 mr-2"
                src={video}
                alt="화상채팅 바로가기"
              />
              <p> 화상채팅 바로가기 </p>
            </Link>
          </div>
        </div>
      </div>
      {/* 하단 컴포넌트 코드 유지 */}
      <hr className="mx-16 my-4 bg-gray-300 h-0.5 border-none" />
      <Main2 />
      <hr className="mx-16 bg-gray-300 h-0.5 border-none" />
      <Main3 />
    </div>
  );
};

export default Main;
