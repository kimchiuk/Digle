import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './pages/MainPage';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  const [showLoginModal, setShowLoginModal ] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
      <BrowserRouter>

      <div>
        <Navbar/>
      </div> 

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        
      </Routes>

      </BrowserRouter>
  );
}

export default App;
