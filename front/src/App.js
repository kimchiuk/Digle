import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./pages/MainPage";
import Signup from "./pages/Signup";
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
        <Route path="/login" element={<Login />} />
        <Route path="/google_login" element={<GoogleLoginComp />} />
        <Route path="/naver_login" element={<NaverLoginButton />} />
        <Route path="/naver_login/callback" element={<NaverLoginCallback />} />
        <Route path="/kakao_login" element={<KakaoLoginButton />} />
        <Route path="/kakao_login/callback" element={<KakaoLoginCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
