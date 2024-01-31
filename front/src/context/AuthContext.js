import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const API_URL = "https://localhost:8000";

  useEffect(() => {
    const formData = new FormData();
    formData.append("withCredentials", true);
    axios
      .get(`${API_URL}/`, formData)
      .then((response) => {
        console.log(response);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
