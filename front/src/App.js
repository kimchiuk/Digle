import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Main from "./pages/main/MainPage";
import Signup from "./pages/signup/Signup";
import SignupDetail from "./pages/signup/SignupDetail";

import "./App.css";
import Navbar from "./components/Navbar";
import Profile from "./pages/profile/Profile";
import Login from "./pages/accounts/Login";
import Solution1 from "./pages/solution/Solution1";
import Solution2 from "./pages/solution/Solution2";
import GoogleLoginButton from "./components/GoogleLoginButton";
import GoogleLoginCallback from "./components/GoogleLoginCallback";
import NaverLoginButton from "./components/NaverLoginButton";
import NaverLoginCallback from "./components/NaverLoginCallback";
import KakaoLoginButton from "./components/KakaoLoginButton";
import KakaoLoginCallback from "./components/KakaoLoginCallback";
import CreateRoom from "./components/WebRTC/CreateRoom";
import VideoChat from "./components/WebRTC/VideoChat";
import TestRouter from "./pages/test/TestRouter";
import FindPassword from "./pages/accounts/FindPassword";
import ChangePassword from "./pages/accounts/ChangePassword";

// 나중에 반드시 지우셈
import Anhs from "./components/WebRTC/hyunsung";

function App() {
  return (
    <div className="select-none">
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* 이부분 반드시 삭제하셈 */}
          <Route path="/anhs" element={<Anhs />} />

          <Route path="/" element={<Main />} />
          <Route path="/test_router" element={<TestRouter />} />
          {/* authContext가 완성 될 경우 아래 두개와 바꾸기 */}
          {/* <PublicRoute path="/signup" element={<Signup />} />
          <PublicRoute path="/signup/detail" element={<SignupDetail />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/detail" element={<SignupDetail />} />
          {/* <PrivateRoute path="/profile" element={<Profile />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/solution/1/" element={<Solution1 />} />
          <Route path="/solution/2/" element={<Solution2 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/google_login" element={<GoogleLoginButton />} />
          <Route
            path="/google_login/callback"
            element={<GoogleLoginCallback />}
          />
          <Route path="/naver_login" element={<NaverLoginButton />} />
          <Route
            path="/naver_login/callback"
            element={<NaverLoginCallback />}
          />
          <Route path="/kakao_login" element={<KakaoLoginButton />} />
          <Route
            path="/kakao_login/callback"
            element={<KakaoLoginCallback />}
          />
          <Route path="/find_password" element={<FindPassword />} />
          <Route path="/change_password" element={<ChangePassword />} />
          <Route path="/CreateRoom" element={<CreateRoom />} />
          <Route path="/vchat" element={<VideoChat />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
