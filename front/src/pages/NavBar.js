import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  // Navbar 컴포넌트 정의
  const [isLogin, setIsLogin] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState("bg-transparent text-black");

  // 로그인상태를 토글하는 함수
  const toggleLogin = () => {
    setIsLogin(!isLogin);
  };

  // 스크롤에 따라 내브바 스타일을 변경
  const changeNavbarStyle = () => {
    if (window.scrollY > 80) {
      setNavbarStyle("bg-blue-500 text-white");
    } else {
      setNavbarStyle("bg-transparent text-black");
    }
  };

  // 컴포넌트가 마운트될 때 스크롤 이벤트 리스너를 추가
  useEffect(() => {
    window.addEventListener("scroll", changeNavbarStyle);
    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
      window.removeEventListener("scroll", changeNavbarStyle);
    };
  }, []);

  return (
    <nav
      className={`flex items-center justify-between px-24 py-2 ${navbarStyle} fixed w-full transition-colors duration-300 ease-in-out z-10`}
    >
      {/* 로고 */}
      <div className="ml-4">
        <a href="/" className="text-xl font-semibold hover:text-black">
          Digle
        </a>
      </div>

      {/* 메뉴 */}
      <div className="mr-4 whitespace-nowrap">
        {!isLogin ? (
          // 로그인 시 보여줄 메뉴
          <>
            <button
              onClick={toggleLogin}
              className="px-4 py-0.25 rounded hover:text-black"
            >
              Logout
            </button>
            <a href="/profile" className="px-4 py-2 rounded hover:text-black">
              Profile
            </a>
          </>
        ) : (
          // 로그아웃 시 보여줄 메뉴
          <>
            <Link to="login" className="px-4 py-2 rounded hover:text-black">
              Login
            </Link>
            <Link to="signup" className="px-4 py-2 rounded hover:text-black">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
