// components/LoginButton.js
import React from 'react';

const LoginButton = ({ onLogin }) => {
    const handleLogin = async () => {
        const response = await fetch('http://localhost:8000/login/naver');
        const result = await response.json();
        onLogin(result);
    };

    return (
        <button onClick={handleLogin}>Login with Naver</button>
    );
};

export default LoginButton;
