import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const Navbar = () => {
  const [cookies] = useCookies(["isLogin"]);

  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const [isSolutionDropdownOpen, setSolutionDropdownOpen] = useState(false);

  // Refs for the dropdown containers
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

  // Close dropdown when clicking outside
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

  useEffect(() => {
    // Attach event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Detach event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array ensures that effect runs only once on mount

  return (
    <nav className={`flex items-center justify-between px-24 py-2 bg-white fixed w-full text-black z-10 shadow-md`}>
      <div className="flex items-center">
        <div className="mr-4">
          <Link to="/" className="text-xl font-semibold hover:text-black">
            <span className="text-blue-500">D</span>igle
          </Link>
        </div>
        <div className="relative inline-block text-left" ref={productDropdownRef}>
          <button
            onClick={toggleProductDropdown}
            type="button"
            className={`inline-flex items-center px-4 py-2 font-medium ${isProductDropdownOpen
                ? "text-black bg-gray-100"
                : "text-gray-700 hover:text-black hover:bg-gray-100"
              }`}
            id="product-dropdown"
            aria-expanded={isProductDropdownOpen}
          >
            Product
            <svg
              className={`-mr-1 ml-2 h-5 w-5 ${isProductDropdownOpen ? "transform rotate-180" : ""
                }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`${isProductDropdownOpen ? "block" : "hidden"
              } absolute right-0 mt-2 ml-4 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg`}
          >
            <div className="py-2">
              <Link
                to="/TestTemp"
                className="block px-4 py-2 text-center text-gray-700 hover:bg-gray-100 hover:text-black"
                onClick={() => handleDropdownItem()}
              >
                Test
              </Link>
              <Link
                to="/anhs"
                className="block px-4 py-2 text-center text-gray-700 hover:bg-gray-100 hover:text-black"
                onClick={() => handleDropdownItem()}
              >
                Conference
              </Link>
            </div>
          </div>
        </div>
        <div className="relative inline-block text-left" ref={solutionDropdownRef}>
          <button
            onClick={toggleSolutionDropdown}
            type="button"
            className={`inline-flex items-center px-4 py-2 font-medium ${isSolutionDropdownOpen
                ? "text-black bg-gray-100"
                : "text-gray-700 hover:text-black hover:bg-gray-100"
              }`}
            id="solution-dropdown"
            aria-expanded={isSolutionDropdownOpen}
          >
            Support
            <svg
              className={`-mr-1 ml-2 h-5 w-5 ${isSolutionDropdownOpen ? "transform rotate-180" : ""
                }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`${isSolutionDropdownOpen ? "block" : "hidden"
              } absolute right-0 mt-2 ml-4 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-lg`}
          >
            <div className="py-2">
              <Link
                to="/solution/1/"
                className="block px-4 py-2 text-center text-gray-700 hover:bg-gray-100 hover:text-black"
                onClick={() => handleDropdownItem()}
              >
                자주 묻는 질문
              </Link>
              <Link
                to="/solution/2/"
                className="block px-4 py-2 text-center text-gray-700 hover:bg-gray-100 hover:text-black"
                onClick={() => handleDropdownItem()}
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mr-4 whitespace-nowrap">
        {cookies.isLogin ? (
          <>
            <Link
              to="/logout"
              className="px-4 py-2 rounded font-medium text-gray-700 hover:text-black hover:bg-gray-100"
            >
              Logout
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 rounded font-medium text-gray-700 hover:text-black hover:bg-gray-100"
            >
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded font-medium text-gray-700 hover:text-black hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded font-medium text-gray-700 hover:text-black hover:bg-gray-100"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
