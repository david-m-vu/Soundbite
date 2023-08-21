import "./NavBar.css";
import logo from "../../assets/BACH.svg";

import { setLogout } from "../../state/index.js";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const NavBar = (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleClickToSignIn = () => {
    if (user) {
      dispatch(setLogout());
    }
    navigate("/login");
  };

  const decideSpotifyConnectMessage = () => {
    if (user) {
      if (user.spotifyToken) {
        return "Reconnect to Spotify"
      } else {
        return "Connect to Spotify"
      }
    } else {
      return "Connect to Spotify"
    }
  }

  return (
    <div className="NavBar">
      <img className="logo" alt="BACH" src={logo} onClick={() => (location.pathname !== "/connect") && navigate("/main")}/>
      <div className="sessionData">
        {(location.pathname !== "/login" && location.pathname !== "/connect") && <button className=" redirectConnectButton standardButton" onClick={() => navigate("/connect")}>{decideSpotifyConnectMessage()}</button>}
        <p
          onClick={() => setShowOptions((prev) => !prev)}
          className="userInfo unselectable"
        >
          {user && user.username}
        </p>
        {showOptions && (
          <div className="options unselectable">
            <p>Upgrade</p>
            <p>Settings</p>
            <p className="toSignIn" onClick={() => handleClickToSignIn()}>
              Sign Out
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
