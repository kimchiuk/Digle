import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    // fetch를 사용하여 데이터 가져오기
    axios("apiUrl", {
      method: "GET",
      credentials: "include", // include credentials (cookies)
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // 응답 헤더에서 Set-Cookie 가져오기
        const setCookieHeader = response.headers.get("Set-Cookie");

        // Set-Cookie 헤더에서 access_token 추출
        const accessTokenMatch = setCookieHeader.match(/access_token=([^;]+)/);

        // 추출한 access_token 값이 있다면 출력
        if (accessTokenMatch) {
          const accessToken = accessTokenMatch[1];
          console.log("Access Token:", accessToken);
        } else {
          console.log("Access Token이 없습니다.");
        }
        // 다른 응답 처리 로직을 여기에 추가할 수 있습니다.
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });

  const isLogin = () => !!localStorage.getItem("token");
  const login = () => {
    if (isLogin) {
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    if (!isLogin) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    }
  };

  const contextValue = {
    isLoggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
