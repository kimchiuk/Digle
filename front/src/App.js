import { BrowserRouter, Route, Routes } from "react-router-dom";

import Signup from "./pages/signup/Signup";
import SignupDetail from "./pages/signup/SignupDetail";
import "./App.css";
import Main from "./pages/Main";
import Navbar from "./components/NavBar";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signup/detail" element={<SignupDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
