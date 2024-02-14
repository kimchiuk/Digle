import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "routes/Loading";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ status: "loading" });
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios
      .post(`${API_URL}/verifyToken`, {}, { withCredentials: true })
      .then((response) => {
        console.log(response);
        setAuthState({ status: "loggedIn" });
      })
      .catch((err) => {
        console.log(err);
        setAuthState({ status: "loggedOut" });
      });
  }, []);
  if (authState.status === "loading") {
    return <Loading />; // 로딩 중이면 로딩 컴포넌트 표시
  }

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
