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

// 혹시 삭제해야한다면 여기 src/index.js 또는 src/App.js 등에 추가

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';  // 백엔드 서버의 주소로 설정

//##### 나머지 코드에서 axios로 API 요청을 보낼 수 있음

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