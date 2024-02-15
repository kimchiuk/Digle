import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { AuthContext } from "context/AuthContext";

import logo from "../assets/Logo.png"

const API_URL = process.env.REACT_APP_API_BASE_URL;

const Navbar = () => {
  const { authState, setAuthState } = useContext(AuthContext);

  // const [cookies] = useCookies(["__Host-access_token"]);
  // const [isLoggedIn, setIsLoggedIn] = useState(!!cookies['__Host-access_token']);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState(""); // 'Standard' 또는 'Business'

  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const [isSolutionDropdownOpen, setSolutionDropdownOpen] = useState(false);

  const productDropdownRef = useRef(null);
  const solutionDropdownRef = useRef(null);

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!isProductDropdownOpen);
    setSolutionDropdownOpen(false);
  };

  const toggleSolutionDropdown = () => {
    setSolutionDropdownOpen(!isSolutionDropdownOpen);
    setProductDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      productDropdownRef.current &&
      !productDropdownRef.current.contains(event.target) &&
      solutionDropdownRef.current &&
      !solutionDropdownRef.current.contains(event.target)
    ) {
      setProductDropdownOpen(false);
      setSolutionDropdownOpen(false);
    }
  };

  const handleDropdownItem = () => {
    setProductDropdownOpen(false);
    setSolutionDropdownOpen(false);
  };
  //

  useEffect(() => {
    if (authState.status === "loggedIn") {
      axios
        .get(`${API_URL}/get_user_name_and_type`, { withCredentials: true })
        .then((res) => {
          setUserName(res.data.user_name);
          setUserType(res.data.user_type);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  }, [authState]);

  return (
    <nav className="flex items-center max-h-[56px] justify-between px-24 py-2 bg-white fixed w-full text-black z-10 shadow-md">
      <div className="flex items-center">
        <div className="mr-4">
          <Link to="/" className="text-xl font-semibold hover:text-black">
            <img className="w-20 min-w-20" src={logo} alt="로고" />
          </Link>
        </div>
        <div
          className="relative inline-block text-left"
          ref={productDropdownRef}
        >
          <button
            onClick={toggleProductDropdown}
            type="button"
            className={`inline-flex text-nowrap items-center px-4 py-2 font-bold ${
              isProductDropdownOpen
                ? "text-black bg-gray-100"
                : "text-gray-700 hover:text-black hover:bg-gray-100"
            }`}
            id="product-dropdown"
            aria-expanded={isProductDropdownOpen}
          >
            서비스
            <svg
              className={`-mr-1 ml-2 h-5 w-5 ${
                isProductDropdownOpen ? "transform rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`${
              isProductDropdownOpen ? "block" : "hidden"
            } absolute right-0 mt-2 ml-4 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg`}
          >
            <div className="py-2">
              <Link
                to="/TestTemp"
                className="block px-4 py-2 text-center font-semibold text-gray-700 hover:bg-gray-100 hover:text-black"
                onClick={() => handleDropdownItem()}
              >
                시험 응시
              </Link>
              <Link
                to="/create_room"
                className="block px-4 py-2 text-center font-semibold text-gray-700 hover:bg-gray-100 hover:text-black"
                onClick={() => handleDropdownItem()}
              >
                화상 채팅방
              </Link>
            </div>
          </div>
        </div>
        <div
          className="relative inline-block text-left"
          ref={solutionDropdownRef}
        >
          <button
            onClick={toggleSolutionDropdown}
            type="button"
            className={`inline-flex text-nowrap items-center px-4 py-2 font-bold ${
              isSolutionDropdownOpen
                ? "text-black bg-gray-100"
                : "text-gray-700 hover:text-black hover:bg-gray-100"
            }`}
            id="solution-dropdown"
            aria-expanded={isSolutionDropdownOpen}
          >
            고객지원
            <svg
              className={`-mr-1 ml-2 h-5 w-5 ${
                isSolutionDropdownOpen ? "transform rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`${
              isSolutionDropdownOpen ? "block" : "hidden"
            } absolute right-0 mt-2 ml-4 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg`}
          >
            <div className="py-2">
              <Link
                to="/solution/1/"
                className="block px-4 py-2 text-center text-gray-700 font-semibold hover:bg-gray-100 hover:text-black"
                onClick={() => handleDropdownItem()}
              >
                자주 묻는 질문
              </Link>
              <Link
                to="/solution/2/"
                className="block px-4 py-2 text-center text-gray-700 font-semibold hover:bg-gray-100 hover:text-black"
                onClick={() => handleDropdownItem()}
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mr-4 whitespace-nowrap">
        {authState.status === "loggedIn" && userType === "Business" && (
          <Link
          to="/create_test_room"
          className="px-4 py-2 font-bold mr-4 rounded text-gray-700 hover:text-black hover:bg-gray-100"
        >
          시험 방 만들기
        </Link>
        )}
        {authState.status === "loggedIn" ? (
          <>
            <Link
              to="/logout"
              className="px-4 py-2 rounded font-bold text-gray-700 hover:text-black hover:bg-gray-100"
            >
              로그아웃
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 rounded font-bold text-gray-700 hover:text-black hover:bg-gray-100"
            >
              프로필
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded font-bold text-gray-700 hover:text-black hover:bg-gray-100"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded font-bold text-gray-700 hover:text-black hover:bg-gray-100"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
