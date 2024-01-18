import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./pages/MainPage";
import Signup from "./pages/signup/Signup";
import SignupDetail from "./pages/signup/SignupDetail";
import "./App.css";
import Main from "./pages/Main";
import Navbar from "./components/NavBar";
import Profile from "./pages/profile/Profile";
import Login from "./pages/Login";
import GoogleLoginComp from "./components/GoogleLoginComp";
import NaverLoginButton from "./components/NaverLoginButton";
import NaverLoginCallback from "./components/NaverLoginCallback";
import KakaoLoginButton from "./components/KakaoLoginButton";
import KakaoLoginCallback from "./components/KakaoLoginCallback";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/detail" element={<SignupDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google_login" element={<GoogleLoginComp />} />
        <Route path="/naver_login" element={<NaverLoginButton />} />
        <Route path="/naver_login/callback" element={<NaverLoginCallback />} />
        <Route path="/kakao_login" element={<KakaoLoginButton />} />
        <Route path="/kakao_login/callback" element={<KakaoLoginCallback />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
