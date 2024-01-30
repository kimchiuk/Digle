import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const API_URL = "https://localhost:8000";

  useEffect(() => {
    const cookieAccessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    if (cookieAccessToken) {
      setAccessToken(cookieAccessToken);
    }
  }, []);

  const updateAccessToken = (newToken) => {
    setAccessToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ accessToken, updateAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const contextValue = useContext(AuthContext);

  if (!contextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return contextValue;
};

export const useAuthenticate = () => {
  const API_URL = "https://localhost:8000";
  useEffect(() => {
    axios
      .get(`${API_URL}/`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const isUserLoggedIn = false;

  return isUserLoggedIn;
};
