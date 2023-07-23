import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Main from "./scenes/Main/Main.jsx";
import LoginPage from "./scenes/LoginPage/LoginPage.jsx";


const App = () => {
  const [spotifyToken, setSpotifyToken] = useState("");
  const isAuth = Boolean(useSelector((state) => state.token));

  useEffect(() => {
    const getToken = async () => {
      const response = await fetch("http://localhost:3001/spotify/token");
      if (response.ok) {
        const json = await response.json();
        setSpotifyToken(json.access_token);
      }
    };
    getToken();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/main" element={isAuth ? <Main spotifyToken={spotifyToken} isAuth={isAuth}/> : <Navigate to="/"/>}/>
        <Route path="/" element={<LoginPage/>}/>
      </Routes>
    </div>
  );
};

export default App;
