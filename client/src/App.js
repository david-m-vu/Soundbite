import './App.css';
import { useState } from "react";
import { getGPTPlaylistRecommendation } from "./requests/openai.js"

const App = () => {
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  }

  const handleSubmitGPTInput = async () => {
    if (input) {
      let recommendations = await getGPTPlaylistRecommendation(input);
      setRecommendations(recommendations);
      setInput("");
    }
  }

  const checkAccessToken = () => {
    let tokenRegex = /access_token=([^&]*)/;
    let token = window.location.href.match(tokenRegex);
    return token ? true : false;
  }
  
  return (
    <div className="App">
      <a href="http://localhost:3001/spotify/login"><button className="connectSpotify">Connect to Spotify</button></a>
      <div className="activityInput">
        <label for="gptInput">Input a Mood/Activity</label>
        <input id="gptInput" type="text" value={input} onChange={handleInputChange}></input>
      </div>
      <button onClick={handleSubmitGPTInput}>Submit</button>
      <h2>{recommendations}</h2>
    </div>
  );
}

export default App;
