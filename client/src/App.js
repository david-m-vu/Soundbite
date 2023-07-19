import './App.css';
import { useState, useEffect } from "react";
import { generateGPTRecPlaylist } from "./requests/recommendations.js"
import WebPlayback from "./components/WebPlayback.jsx";

const App = () => {
  const [input, setInput] = useState("");
  const [token, setToken] = useState("");
  const [playlistURI, setPlaylistURI] = useState("");

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

  const handleInputChange = (e) => {
    setInput(e.target.value);
  }

  const handleSubmitGPTInput = async () => {
    if (input && token) {
      let playlistURI = await generateGPTRecPlaylist(token, input);
      setPlaylistURI(playlistURI);
      console.log(playlistURI);

      setInput("");
    } else if (!token) {
      console.log("No access token")
    }
  }

  return (
    <div className="App">

      <div className="activityInput">
        <label htmlFor="gptInput">Input a Mood/Activity</label>
        <input id="gptInput" type="text" value={input} onChange={handleInputChange}></input>
      </div>
      <button onClick={handleSubmitGPTInput}>Submit</button>

      {(token === "") ?
        <a href="http://localhost:3001/spotify/login">
          <button className="connectSpotify">Connect to Spotify</button>
        </a>
        : <WebPlayback token={token} playlistURI={playlistURI} />
      }

    </div>
  );
}

export default App;
