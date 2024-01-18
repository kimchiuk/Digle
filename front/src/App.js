import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./pages/MainPage";
import Signup from "./pages/signup/Signup";
import SignupDetail from "./pages/signup/SignupDetail";
import Login from "./pages/Login";
import GoogleLoginComp from "./components/GoogleLoginComp";
import Test from "./pages/TestPage";

function App() {
  return ( 
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/detail" element={<SignupDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google_login" element={<GoogleLoginComp />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
