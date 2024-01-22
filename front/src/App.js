import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Main from "./pages/main/MainPage";
import Signup from "./pages/signup/Signup";
import SignupDetail from "./pages/signup/SignupDetail";
import "./App.css";
import NavBar from "./components/NavBar";
import Profile from "./pages/profile/Profile";
import Login from "./pages/auth/Login";
import GoogleLoginButton from "./components/GoogleLoginButton";
import GoogleLoginCallback from "./components/GoogleLoginCallback";
import NaverLoginButton from "./components/NaverLoginButton";
import NaverLoginCallback from "./components/NaverLoginCallback";
import KakaoLoginButton from "./components/KakaoLoginButton";
import KakaoLoginCallback from "./components/KakaoLoginCallback";
import Test from "./pages/TestPage";
import FindUsername from "./pages/auth/FindUsername";
import FindPassword from "./pages/auth/FindPassword";

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/test" element={<Test />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/detail" element={<SignupDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google_login" element={<GoogleLoginButton />} />
        <Route path="/google_login/callback" element={<GoogleLoginCallback />} />
        <Route path="/naver_login" element={<NaverLoginButton />} />
        <Route path="/naver_login/callback" element={<NaverLoginCallback />} />
        <Route path="/kakao_login" element={<KakaoLoginButton />} />
        <Route path="/kakao_login/callback" element={<KakaoLoginCallback />} />
        <Route path="/find_username" element={<FindUsername />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
