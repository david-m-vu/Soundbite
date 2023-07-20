import './App.css';
import { useState, useEffect } from "react";
import { generateGPTRecPlaylist } from "./requests/recommendations.js"
import { getPlaylistTrackURIs } from "./requests/spotify.js";
import WebPlayback from "./components/WebPlayback/WebPlayback.jsx";
import Playlist from "./components/Playlist/Playlist.jsx";

const App = () => {
  const [activityInput, setActivityInput] = useState("");
  const [durationInput, setDurationInput] = useState("");
  const [token, setToken] = useState("");
  const [playlistURI, setPlaylistURI] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);

  //unused
  const [playlistID, setPlaylistID] = useState("");
  const [trackURIs, setTrackURIs] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const response = await fetch("http://localhost:3001/spotify/token");
      if (response.ok) {
        const json = await response.json();
        setToken(json.access_token);
      }
    }
    getToken();
  }, []);

  const handleActivityInputChange = (e) => {
    setActivityInput(e.target.value);
  }

  const handleDurationInputChange = (e) => {
    setDurationInput(e.target.value);
  }

  const handleSubmitGPTInput = async () => {
    if (activityInput && token) {
      let { playlistID, playlistURI, tracksInfo } = await generateGPTRecPlaylist(token, activityInput, durationInput);
      setPlaylistURI(playlistURI);

      // setPlaylistID(playlistID);
      // setTrackURIs(await getPlaylistTrackURIs(token, playlistID));

      setPlaylists((prev) => [...prev, tracksInfo]);
      setActivePlaylist(tracksInfo);

      setActivityInput("");
      setDurationInput("");

    } else if (!token) {
      console.log("No access token")
    }
  }

  return (
    <div className="App">

      {((token) === "") &&
        <a href="http://localhost:3001/spotify/login">
          <button className="connectSpotify">Connect to Spotify</button>
        </a>
      }

      <div className="inputs">
        <div className="activity">
          <label htmlFor="activityInput">Input a Mood/Activity</label>
          <input id="activityInput" type="text" value={activityInput} onChange={handleActivityInputChange}></input>
        </div>
        <div className="duration">
          <label htmlFor="durationInput">Input the duration in hours (optional)</label>
          <input id="durationInput" type="text" value={durationInput} onChange={handleDurationInputChange}></input>
        </div>
      </div>
      <button onClick={handleSubmitGPTInput}>Submit</button>

      {playlistURI && <WebPlayback token={token} playlistURI={playlistURI} playlistID={playlistID} trackURIs={trackURIs} />}

      {activePlaylist && <Playlist playlist={activePlaylist} />}

    </div>
  );
}

export default App;
