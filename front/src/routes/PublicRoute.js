// import { useContext } from "react";
// import { Outlet, Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const PublicRoute = () => {
//   const auth = useContext(AuthContext);
//   return auth.isLoggedIn ? <Navigate to="/" /> : <Outlet />;
// };

// export default PublicRoute;
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ element, ...props }) => {
  const { accessToken } = useAuth();

  return accessToken ? (
    <Navigate to="/" />
  ) : (
    <Route {...props} element={element} />
  );
};

export { PublicRoute };
