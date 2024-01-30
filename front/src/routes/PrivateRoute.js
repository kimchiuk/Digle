// import { useContext } from "react";
// import { Outlet, Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const PrivateRoute = () => {
//   const auth = useContext(AuthContext);

//   return auth.isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;

import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ element, ...props }) => {
  const { accessToken } = useAuth();

  return accessToken ? (
    <Route {...props} element={element} />
  ) : (
    <Navigate to="/login" />
  );
};
export { PrivateRoute };
