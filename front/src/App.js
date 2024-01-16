// import logo from "./logo.svg";
// import "./App.css";
// import JanusPage from "./pages/JanusPage";

// function App() {
//   return (
//     <div className="App">
//       <JanusPage />
//     </div>
//   );
// }

// export default App;

// App.js
import React, { useState } from 'react';
import LoginButton from './components/LoginButton';

const App = () => {
    const [user, setUser] = useState(null);

    const handleLogin = (result) => {
        setUser(result.user);
        // 이후 처리 로직을 추가할 수 있습니다.
    };

    return (
        <div>
            {user ? (
                <div>
                    <p>Welcome, {user.name}!</p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <LoginButton onLogin={handleLogin} />
            )}
        </div>
    );
};

export default App;