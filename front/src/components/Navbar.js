import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const [isSolutionDropdownOpen, setSolutionDropdownOpen] = useState(false);

  const toggleLogin = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!isProductDropdownOpen);
    // Close Solution dropdown when Product dropdown is toggled
    setSolutionDropdownOpen(false);
  };

  const toggleSolutionDropdown = () => {
    setSolutionDropdownOpen(!isSolutionDropdownOpen);
    // Close Product dropdown when Solution dropdown is toggled
    setProductDropdownOpen(false);
  };

  return (
    <nav className={`flex items-center justify-between px-24 py-2 bg-white fixed w-full text-black z-10 shadow-md`}>
      {/* Logo and Dropdowns */}
      <div className="flex items-center">
        {/* 로고 */}
        <div className="mr-4">
          <Link to="/" className="text-xl font-semibold hover:text-black">
            <span className="text-blue-500">D</span>igle
          </Link>
        </div>

        {/* Product Dropdown */}
        <div className="relative inline-block text-left">
          <button
            onClick={toggleProductDropdown}
            type="button"
            className={`inline-flex items-center px-4 py-2 font-medium ${isProductDropdownOpen ? 'text-black bg-gray-100' : 'text-gray-700 hover:text-black hover:bg-gray-100'}`}
            id="product-dropdown"
            aria-expanded={isProductDropdownOpen}
          >
            Product
            <svg
              className={`-mr-1 ml-2 h-5 w-5 ${isProductDropdownOpen ? 'transform rotate-180' : ''}`}
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
          {/* Dropdown menu */}
          <div className={`${isProductDropdownOpen ? 'block' : 'hidden'} absolute right-0 mt-2 ml-4 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg`}>
            <div className="py-2">
              <Link to="/test" className="block text-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black">
                Test
              </Link>
              <Link to="/conference" className="block text-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black">
                Conference
              </Link>
            </div>
          </div>
        </div>

        {/* Solution Dropdown */}
        <div className="relative inline-block text-left">
          <button
            onClick={toggleSolutionDropdown}
            type="button"
            className={`inline-flex items-center px-4 py-2 font-medium ${isSolutionDropdownOpen ? 'text-black bg-gray-100' : 'text-gray-700 hover:text-black hover:bg-gray-100'}`}
            id="solution-dropdown"
            aria-expanded={isSolutionDropdownOpen}
          >
            고객 지원
            <svg
              className={`-mr-1 ml-2 h-5 w-5 ${isSolutionDropdownOpen ? 'transform rotate-180' : ''}`}
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
          {/* Dropdown menu */}
          <div className={`${isSolutionDropdownOpen ? 'block' : 'hidden'} absolute right-0 mt-2 ml-4 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg`}>
            <div className="py-2">
              <Link to="/solution/1/" className="block px-4 py-2 text-center text-gray-700 hover:bg-gray-100 hover:text-black">
                자주 묻는 질문
              </Link>
              <Link to="/solution/2/" className="block px-4 py-2 text-center text-gray-700 hover:bg-gray-100 hover:text-black">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="mr-4 whitespace-nowrap">
        {isLogin ? (
          <>
            <button onClick={toggleLogin} className="px-4 py-2 rounded font-medium text-gray-700 hover:text-black hover:bg-gray-100">
              Logout
            </button>
            <Link to="/profile" className="px-4 py-2 rounded font-medium text-gray-700 hover:text-black hover:bg-gray-100">
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 rounded font-medium text-gray-700 hover:text-black hover:bg-gray-100">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 rounded font-medium text-gray-700 hover:text-black hover:bg-gray-100">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
