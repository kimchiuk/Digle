import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
