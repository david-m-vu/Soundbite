import "./Main.css";
import { useState } from "react";
import { generateGPTRecPlaylist } from "../../requests/recommendations.js";
import WebPlayback from "../../components/WebPlayback/WebPlayback.jsx";
import Playlist from "../../components/Playlist/Playlist.jsx";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPlaylists, setLogout } from "../../state/index.js";

const backendBaseURL = "https://soundbite-backend.onrender.com";

const Main = (props) => {
  const [activityInput, setActivityInput] = useState("");
  const [durationInput, setDurationInput] = useState("");
  const [activePlaylist, setActivePlaylist] = useState(null); // element of playlists
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(-1);
  const [activeSongIndex, setActiveSongIndex] = useState(-1);
  const [deviceID, setDeviceID] = useState("");

  const [isAddingPlaylist, setIsAddingPlaylist] = useState(false);

  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const getUser = async () => {
  //   const response = await fetch(`http://localhost:3001/users/${user._id}`, {
  //     headers: {
  //       "Authorization": `Bearer ${token}`
  //     }
  //   });
  //   const data = await response.json();
  //   setUser(data);
  // }

  const handleActivityInputChange = (e) => {
    setActivityInput(e.target.value);
  };

  const handleDurationInputChange = (e) => {
    setDurationInput(e.target.value);
  };

  const handleSubmitGPTInput = async () => {
    if (activityInput && props.spotifyToken) {
      if (durationInput === "") {
        setDurationInput("1");
      }
      let newPlaylist = await generateGPTRecPlaylist(
        user._id,
        token,
        props.spotifyToken,
        activityInput,
        durationInput
      );

      setActivePlaylist(newPlaylist);
      setActivePlaylistIndex(user.playlists.length)
      setActivityInput("");
      setDurationInput("");
      setIsAddingPlaylist(false);

      dispatch(setPlaylists({ playlists: [...user.playlists, newPlaylist] }));
    } else if (!props.spotifyToken) {
      console.log("No access token");
    }
  };

  const handleDeletePlaylist = async (playlistID) => {
    let response = await fetch(`${backendBaseURL}/users/${user._id}/playlists/${playlistID}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    let newPlaylists = await response.json();
    setActivePlaylist(null)
    dispatch(setPlaylists({ playlists: newPlaylists}));    
  }

  const handleClickToSignIn = () => {
    if (user) {
      dispatch(setLogout());
    }
    navigate("../")
  }

  const selectPlaylist = (index) => {
    setActivePlaylistIndex(index);
    setActivePlaylist(user.playlists[index]);

    setActiveSongIndex(-1);
  };

  const getPlaylistLabelClassName = (index) => {
    if (index === activePlaylistIndex) {
      return "activePlaylistLabel";
    } else {
      return "inactivePlaylistLabel";
    }
  };

  return (
    <div className="Main">
      <div className="connectOverlay overlay">
        {props.spotifyToken === "" && (
          <a href={`${backendBaseURL}/spotify/login`}>
            <button className="connectSpotify">Connect to Spotify</button>
          </a>
        )}
      </div>
      {props.spotifyToken === "" && <div className="backgroundOverlay"></div>}

      <div className="playlistList">
        {user.playlists.map((playlist, index) => {
          return (
            <div key={playlist.uri} className="playlistListItem">
              <p
                className={getPlaylistLabelClassName(index)}
                onClick={() => selectPlaylist(index)}
              >
                {playlist.name}
              </p>
              <div className="deletePlaylistButton"> 
                <CloseIcon onClick={() => handleDeletePlaylist(playlist._id)} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="top">
        <button
          className="generatePlaylistButton"
          onClick={() => setIsAddingPlaylist(true)}
        >
          Generate new playlist
        </button>
        <h1>User: {user.firstName}</h1>
        <button className="toSignIn" onClick={() => handleClickToSignIn()}>
          {props.isAuth ? "Sign Out" : "Login"}
        </button>
      </div>

      {isAddingPlaylist && (
        <div className="chatOverlay overlay">
          <div className="inputs">
            <div className="activity">
              <label htmlFor="activityInput">Input a Mood/Activity</label>
              <input
                id="activityInput"
                type="text"
                value={activityInput}
                onChange={handleActivityInputChange}
              ></input>
            </div>
            <div className="duration">
              <label htmlFor="durationInput">
                Input the duration in hours (optional)
              </label>
              <input
                id="durationInput"
                type="text"
                value={durationInput}
                onChange={handleDurationInputChange}
              ></input>
            </div>
            <button className="submitButton" onClick={handleSubmitGPTInput}>
              Submit
            </button>
          </div>
          <div
            className="closeChatButton"
            onClick={() => setIsAddingPlaylist(false)}
          >
            <CloseIcon fontSize="large" />
          </div>
        </div>
      )}
      {isAddingPlaylist && <div className="backgroundOverlay"></div>}

      {activePlaylist && (
        <div className="playlistTracks">
          <Playlist
            token={props.spotifyToken}
            activePlaylist={activePlaylist}
            activeSongIndex={activeSongIndex}
            setActiveSongIndex={setActiveSongIndex}
            deviceID={deviceID}
          />
        </div>
      )}

      <div className="playback">
        {props.spotifyToken && (
          <WebPlayback
            token={props.spotifyToken}
            activeSongIndex={activeSongIndex}
            setDeviceID={setDeviceID}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
