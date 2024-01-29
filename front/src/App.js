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
import NaverLoginButton from "./components/NaverLoginButton";
import KakaoLoginButton from "./components/KakaoLoginButton";
import CreateRoom from "./components/WebRTC/CreateRoom";
import VideoChat from "./components/WebRTC/VideoChat";
import Test from "./pages/TestPage";
import FindPassword from "./pages/accounts/FindPassword";
import ChangePassword from "./pages/accounts/ChangePassword";
import LoginCallback from "./components/LoginCallback";

function App() {
  return (
    <div className="select-none">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/test" element={<Test />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/detail" element={<SignupDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/solution/1/" element={<Solution1 />} />
          <Route path="/solution/2/" element={<Solution2 />} />
          <Route path="/login" element={<Login />} />

          <Route path="/login/callback" element={<LoginCallback />} />

          <Route path="/google_login" element={<GoogleLoginButton />} />
          <Route path="/naver_login" element={<NaverLoginButton />} />
          <Route path="/kakao_login" element={<KakaoLoginButton />} />

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
