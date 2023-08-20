import "./App.css";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSpotifyToken } from "./state/index.js";
import Main from "./scenes/Main/Main.jsx";
import LoginPage from "./scenes/LoginPage/LoginPage.jsx";
import SpotifyConnect from "./scenes/SpotifyConnect/SpotifyConnect.jsx";
import Create from "./scenes/Create/Create.jsx";

// const backendBaseURL = "https://soundbite-backend.onrender.com"
const backendBaseURL = "http://localhost:3001";

const App = () => {
  const token = useSelector((state) => state.token);
  const isAuth = Boolean(token);
  
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const getToken = async () => {
        const response = await fetch(`${backendBaseURL}/spotify/token`);
        if (response.ok) {
          const json = await response.json();
          dispatch(setSpotifyToken({ spotifyToken: json.access_token}))
        }
      };
      getToken();
    }
  }, [user, dispatch]);


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={isAuth ? <Main isAuth={isAuth} user={user} token={token}/> : <Navigate to="/login"/>}/>
        <Route path="/main" element={isAuth ? <Main isAuth={isAuth} user={user} token={token}/> : <Navigate to="../login"/>}/>
        <Route path="/login" element={<LoginPage token={token}/>}/>
        <Route path="/connect" element={isAuth ? <SpotifyConnect user={user}/> : <Navigate to="../login"/>}/>
        <Route path="/main/create" element={isAuth ? <Create user={user} token={token}/> : <Navigate to="../../login"/>}/>
      </Routes>
    </div>
  );
};

export default App;
