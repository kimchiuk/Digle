import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const API_URL = "https://localhost:8000";

  useEffect(() => {
    axios
      .get(`${API_URL}/`, { withCredentials: true })
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
