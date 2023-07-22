import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./scenes/Main/Main.jsx";
import LoginPage from "./scenes/LoginPage/LoginPage.jsx";

const App = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const response = await fetch("http://localhost:3001/spotify/token");
      if (response.ok) {
        const json = await response.json();
        setToken(json.access_token);
      }
    };
    getToken();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/main" element={<Main token={token}/>}/>
        <Route path="/" element={<LoginPage/>}/>
      </Routes>
    </div>
  );
};

export default App;
