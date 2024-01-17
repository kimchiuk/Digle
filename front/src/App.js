import { BrowserRouter, Route, Routes } from "react-router-dom";

import Signup from "./pages/signup/Signup";
import SignupDetail from "./pages/signup/SignupDetail";
import "./App.css";
import Main from "./pages/Main";
import Navbar from "./pages/NavBar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signup/detail" element={<SignupDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
