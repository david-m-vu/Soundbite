import "./Main.css";
import { useState } from "react";
import { generateGPTRecPlaylist } from "../../requests/recommendations.js";
import WebPlayback from "../../components/WebPlayback/WebPlayback.jsx";
import Playlist from "../../components/Playlist/Playlist.jsx";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const Main = (props) => {
  const [activityInput, setActivityInput] = useState("");
  const [durationInput, setDurationInput] = useState("");

  const [playlists, setPlaylists] = useState([]); // array of objects with playlistName, playlistURI, and an array of tracks
  
  const [activePlaylist, setActivePlaylist] = useState(null); // element of playlists
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(-1);
  const [activeSongIndex, setActiveSongIndex] = useState(-1);
  const [deviceID, setDeviceID] = useState("");

  const [isAddingPlaylist, setIsAddingPlaylist] = useState(false);

  const navigate = useNavigate();

  const handleActivityInputChange = (e) => {
    setActivityInput(e.target.value);
  };

  const handleDurationInputChange = (e) => {
    setDurationInput(e.target.value);
  };

  const handleSubmitGPTInput = async () => {
    if (activityInput && props.token) {
      let { playlistURI, playlistName, tracks } =
      await generateGPTRecPlaylist(props.token, activityInput, durationInput);
      setPlaylists((prev) => [...prev, { playlistURI, playlistName, tracks }]);
      setActivePlaylist({ playlistURI, playlistName, tracks });

      setActivityInput("");
      setDurationInput("");
      setIsAddingPlaylist(false);
    } else if (!props.token) {
      console.log("No access token");
    }
  };

  const selectPlaylist = (index) => {
    setActivePlaylistIndex(index);
    setActivePlaylist(playlists[index])
    
    setActiveSongIndex(-1);
  }

  const getPlaylistLabelClassName = (index) => {
    if (index === activePlaylistIndex) {
      return "activePlaylistLabel";
    } else {
      return "inactivePlaylistLabel";
    }
  }

  return (
    <div className="Main">
      {props.token === "" && (
        <a href="http://localhost:3001/spotify/login">
          <button className="connectSpotify">Connect to Spotify</button>
        </a>
      )}

      <div className="top">
        <button
          className="generatePlaylistButton"
          onClick={() => setIsAddingPlaylist(true)}
        >
          Generate new playlist
        </button>
        <button className="toSignIn" onClick={() => navigate("../")}>
          Login
        </button>
      </div>

      {isAddingPlaylist && (
        <div className="chatOverlay">
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
            className="closeButton"
            onClick={() => setIsAddingPlaylist(false)}
          >
            <CloseIcon fontSize="large" />
          </div>
        </div>
      )}
      {isAddingPlaylist && <div className="backgroundOverlay"></div>}

      <div className="playlistList">
        {playlists.map((playlist, index) => {
          return <p key={playlist.playlistURI} className={getPlaylistLabelClassName(index)} onClick={() => selectPlaylist(index)}>{playlist.playlistName}</p>;
        })}
      </div>

      {activePlaylist && (
        <div className="playlistTracks">
          <Playlist
            token={props.token}
            activePlaylist={activePlaylist}
            activeSongIndex={activeSongIndex}
            setActiveSongIndex={setActiveSongIndex}
            deviceID={deviceID}
          />
        </div>
      )}

      <div className="playback">
        {props.token && (
          <WebPlayback
            token={props.token}
            activeSongIndex={activeSongIndex}
            setDeviceID={setDeviceID}
          />
        )}
      </div>

    </div>
  );
};

export default Main;
