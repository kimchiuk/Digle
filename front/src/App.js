import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './pages/MainPage';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
      <BrowserRouter>

        <Navbar/>

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
      </BrowserRouter>
  );
}

export default App;