import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import NaverLoginButton from "components/auth_login/NaverLoginButton";
import KakaoLoginButton from "components/auth_login/KakaoLoginButton";
import GoogleLoginButton from "components/auth_login/GoogleLoginButton";
import MainImg from "assets/main.png";
import { AuthContext } from "context/AuthContext";

const Login = () => {
  const { setAuthState } = useContext(AuthContext);
  // Cookie에 저장하여 사용할 값 및 관련 Coockie 선언
  const [cookies, setCookie, removeCookie] = useCookies(["rememberUserId"]); // Coockies 이름임
  const [userId, setUserId] = useState(false);
  const [isRemember, setIsRemember] = useState(false); // 아이디 저장 체크박스 체크 유무

  const [email, setEmail] = useState(cookies.rememberUserId || "");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // 저장된 쿠키값이 있으면 checkbox를 True 설정 및 UserId에 값 할당
    if (cookies.rememberUserId !== undefined) {
      setUserId(cookies.rememberUserId);
      setIsRemember(true);
    }
  }, []);

  const handleOnChange = (event) => {
    setIsRemember(event.target.checked);

    if (!event.target.checked) {
      removeCookie("rememberUserId");
      console.log(
        "체크박스 해제하고 쿠키에서 아이디 지아라",
        cookies.rememberUserId
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await axios.post(`${API_URL}/login`, formData, {
        withCredentials: true,
      });
      console.log("로그인 성공: ", response);
      // setCookie("isLogin", true); 2/13
      setAuthState({ status: "loggedIn" });

      if (isRemember) {
        setCookie("rememberUserId", email);
      }

      // 로그인 성공 시 이전 페이지로 이동해줄 거임.
      navigate("/");
    } catch (error) {
      alert("이메일 또는 비밀번호를 다시 확인해주세요.");
      console.error("에러 발생: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <img className="absolute w-full h-full object-cover " src={MainImg} />
      <div className="relative p-8 bg-black bg-opacity-70 rounded shadow-md max-w-sm w-full">
        <h3 className="text-3xl font-bold text-white text-center mb-8">
          로 그 인
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="아이디"
              id="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-gray-700"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white text-gray-700"
              required
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="saveId"
                name="saveId"
                onChange={(event) => {
                  handleOnChange(event);
                }}
                checked={isRemember}
              />
              <label htmlFor="saveId" className="text-white ml-2">
                아이디 저장
              </label>
            </div>
          </div>
          <button className="w-full focus:outline-none text-white bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:ring-sky-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">
            로그인
          </button>
          <div className="text-white text-center">
            <Link to="/signup" className="text-sm hover:underline">
              아이디가 없으신가요?
            </Link>
            <br />
            <Link
              to="/find_password"
              className="text-white text-sm hover:underline"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <hr className="w-28 bg-white h-0.5 border-none" />
            <span className="text-white">OR</span>
            <hr className="w-28 bg-white h-0.5 border-none" />
          </div>
          <div className="flex justify-center space-x-10 bg-white mx-6 p-4 rounded-full">
            <GoogleLoginButton />
            <KakaoLoginButton />
            <NaverLoginButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
