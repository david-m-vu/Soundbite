import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Main from "./scenes/Main/Main.jsx";
import LoginPage from "./scenes/LoginPage/LoginPage.jsx";
import SpotifyConnect from "./scenes/SpotifyConnect/SpotifyConnect.jsx";
import Create from "./scenes/Create/Create.jsx";

const App = () => {
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const isAuth = Boolean(token);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={isAuth ? <Navigate to="/main"/> : <Navigate to="/login"/>}/>
        <Route path="/main" element={isAuth ? <Main isAuth={isAuth} user={user} token={token}/> : <Navigate to="../login"/>}/>
        <Route path="/login" element={<LoginPage token={token}/>}/>
        <Route path="/connect" element={isAuth ? <SpotifyConnect user={user}/> : <Navigate to="../login"/>}/>
        <Route path="/main/create" element={isAuth ? <Create user={user} token={token}/> : <Navigate to="../../login"/>}/>
      </Routes>
    </div>
  );
};

export default App;
