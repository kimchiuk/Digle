import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Main from "./pages/main/MainPage";
import Signup from "pages/accounts/signup/Signup";
import SignupDetail from "pages/accounts/signup/SignupDetail";

import Navbar from "./components/Navbar";
import Profile from "./pages/accounts/profile/Profile";
import Login from "./pages/accounts/Login";
import Solution1 from "./pages/solution/Solution1";
import Solution2 from "./pages/solution/Solution2";
import Solution2Submit from "./pages/solution/Solution2Submit";
import GoogleLoginButton from "components/auth_login/GoogleLoginButton";
import NaverLoginButton from "components/auth_login/NaverLoginButton";
import KakaoLoginButton from "components/auth_login/KakaoLoginButton";
import CreateRoom from "./components/WebRTC/CreateRoom";
import VideoChat from "./components/WebRTC/VideoChat";
import TestRouter from "./pages/test/TestRouter";
import FindPassword from "./pages/accounts/FindPassword";
import ResetPassword from "./pages/accounts/ResetPassword";
import LoginCallback from "./components/auth_login/LoginCallback";
import Logout from "./pages/accounts/Logout";
import InviteUrl from "./components/WebRTC/InviteUrl";

// 쿠키 지우기 성공 시 사용할 수 있는 로직
// 다른 방향으로 구현해보자.
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

// 나중에 반드시 지우셈
import Anhs from "./components/WebRTC/hyunsung";
import CreateRoomTmp from "pages/rooms/CreateRoomTmp";

import TestTemp from "./pages/test/test_temp";
import TestFinish from "./pages/test/test_finish";

//

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
          <Route path="/solution/2/submit" element={<Solution2Submit />} />

          {/* <Route element={<PrivateRoute />}> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          {/* </Route> */}

          <Route path="/login/callback" element={<LoginCallback />} />
          <Route path="/google_login" element={<GoogleLoginButton />} />
          <Route path="/naver_login" element={<NaverLoginButton />} />
          <Route path="/kakao_login" element={<KakaoLoginButton />} />

          <Route path="/find_password" element={<FindPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/CreateRoom" element={<CreateRoom />} />
          <Route path="/vchat" element={<VideoChat />} />

          <Route path="/CreateRoomTmp" element={<CreateRoomTmp />} />
          <Route path="/TestTemp" element={<TestTemp />} />
          <Route path="/test/finish" element={<TestFinish />} />

          <Route path="/join/:inviteCode" element={<InviteUrl />} />
        </Routes>
        <Footer />
        <PageLayout>
          <Routes>
            <Route />
          </Routes>
        </PageLayout>
      </BrowserRouter>
      {/* </AuthProvider> */}
    </div>
  );
}

function PageLayout({ children }) {
  const location = useLocation();
  const noNavbarRoutes = ["/login", "/signup"]; // 네비게이션 바를 보여주지 않을 경로 목록

  // 현재 경로가 noNavbarRoutes에 포함되어 있는지 확인
  const showLayout = !noNavbarRoutes.includes(location.pathname);

  return (
    <div className="select-none">
      {showLayout && <Navbar />}
      {children}
      {showLayout && <Footer />}
    </div>
  );
}

export default App;
