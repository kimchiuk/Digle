import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Main from "./pages/main/MainPage";
import SelectSignup from "./pages/signup/SelectSignup";
import Signup from "./pages/signup/Signup";
import SignupDetail from "./pages/signup/SignupDetail";

import "./App.css";
import NavBar from "./components/Navbar";
import Profile from "./pages/profile/Profile";
import Login from "./pages/accounts/Login";
import GoogleLoginButton from "./components/GoogleLoginButton";
import GoogleLoginCallback from "./components/GoogleLoginCallback";
import NaverLoginButton from "./components/NaverLoginButton";
import NaverLoginCallback from "./components/NaverLoginCallback";
import KakaoLoginButton from "./components/KakaoLoginButton";
import KakaoLoginCallback from "./components/KakaoLoginCallback";
import CreateRoom from "./components/WebRTC/CreateRoom";
import VideoChat from "./components/WebRTC/VideoChat";
import Test from "./pages/TestPage";
import FindPassword from "./pages/accounts/FindPassword";
import ChangePassword from "./pages/accounts/ChangePassword";

function App() {
  return (
    <div className="select-none">
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/test" element={<Test />} />
          <Route path="/selectsignup" element={<SelectSignup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/detail" element={<SignupDetail />} />
          <Route path="/profile" element={<Profile />} />
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
