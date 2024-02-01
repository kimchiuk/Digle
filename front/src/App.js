import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Main from "./pages/main/MainPage";
import Signup from "pages/accounts/signup/Signup";
import SignupDetail from "pages/accounts/signup/SignupDetail";

import Navbar from "./components/Navbar";
import Profile from "./pages/accounts/profile/Profile";
import Login from "./pages/accounts/Login";
import Solution1 from "./pages/solution/Solution1";
import Solution2 from "./pages/solution/Solution2";
import GoogleLoginButton from "components/auth_login/GoogleLoginButton";
import NaverLoginButton from "components/auth_login/NaverLoginButton";
import KakaoLoginButton from "components/auth_login/KakaoLoginButton";
import CreateRoom from "./components/WebRTC/CreateRoom";
import VideoChat from "./components/WebRTC/VideoChat";
import TestRouter from "./pages/test/TestRouter";
import FindPassword from "./pages/accounts/FindPassword";
import ChangePassword from "./pages/accounts/ChangePassword";
import LoginCallback from "./components/auth_login/LoginCallback";
import Logout from "./pages/accounts/Logout";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

// 나중에 반드시 지우셈
import Anhs from "./components/WebRTC/hyunsung";

function App() {
  return (
    <div className="select-none">
      {/* <AuthProvider> */}
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* 이부분 반드시 삭제하셈 */}
          <Route path="/anhs" element={<Anhs />} />

          <Route path="/" element={<Main />} />
          <Route path="/test_router" element={<TestRouter />} />

          {/* <Route element={<PublicRoute />}> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/detail" element={<SignupDetail />} />
          {/* </Route> */}
          <Route path="/solution/1/" element={<Solution1 />} />
          <Route path="/solution/2/" element={<Solution2 />} />

          {/* <Route element={<PrivateRoute />}> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          {/* </Route> */}

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
      {/* </AuthProvider> */}
    </div>
  );
}

export default App;
