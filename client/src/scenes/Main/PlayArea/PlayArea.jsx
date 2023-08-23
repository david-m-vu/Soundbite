import "./PlayArea.css";

import { useState } from "react";
import WebPlayback from "../../../components/WebPlayback/WebPlayback.jsx";
import Playlist from "../../../components/Playlist/Playlist.jsx";
import TrashIcon from "../../../assets/Trash.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPlaylists } from "../../../state/index.js";

// const backendBaseURL = "https://soundbite-backend.onrender.com";
const backendBaseURL = "http://localhost:3001";

const track = {
    name: "",
    album: {
        images: [{ url: "" }],
    },
    artists: [{ name: "" }],
};

const PlayArea = (props) => {
  const [activePlaylist, setActivePlaylist] = useState(null); // element of playlists
  const [playlistPlaying, setPlaylistPlaying] = useState(null); 
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(-1);
  const [deviceID, setDeviceID] = useState("");
  const [currentTrack, setCurrentTrack] = useState(track); // from spotify webplayer

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeletePlaylist = async (playlistID) => {
    let response = await fetch(
      `${backendBaseURL}/users/${props.user._id}/playlists/${playlistID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      }
    );

    let newPlaylists = await response.json();
    setActivePlaylist(null);
    dispatch(setPlaylists({ playlists: newPlaylists }));
  };

  const selectPlaylist = (index) => {
    setActivePlaylistIndex(index);
    setActivePlaylist(props.user.playlists[index]);
  };

  const getPlaylistLabelClassName = (index) => {
    if (index === activePlaylistIndex) {
      return "activePlaylistLabel";
    } else {
      return "inactivePlaylistLabel";
    }
  };

  return (
    <div className="PlayArea">
            <div className="functions">
        <p
          className="createPlaylistButton"
          onClick={() => props.user.spotifyToken ? navigate("/main/create") : navigate("../connect")}
        >
          Create a New Playlist +
        </p>
      </div>
      
      <div className="playlistList">
        {props.user.playlists.map((playlist, index) => {
          return (
            <div key={playlist.uri} className="playlistListItem">
              <p
                className={getPlaylistLabelClassName(index)}
                onClick={() => selectPlaylist(index)}
              >
                {playlist.name}
              </p>
              <div className="deletePlaylistButton">
                <img alt="delete playlist" src={TrashIcon} onClick={() => handleDeletePlaylist(playlist._id)} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="playback">
        {props.user.spotifyToken && (
          <WebPlayback
            token={props.user.spotifyToken}
            setDeviceID={setDeviceID}
            currentTrack={currentTrack}
            setCurrentTrack={setCurrentTrack}
          />
        )}
      </div>

      {activePlaylist ? 
        <div className="playlistTracks">
          <Playlist
            token={props.user.spotifyToken}
            activePlaylist={activePlaylist}
            currentTrack={currentTrack}
            deviceID={deviceID}
            playlistPlaying={playlistPlaying}
            setPlaylistPlaying={setPlaylistPlaying}
          />
        </div> : <div className="filler"/>
      }
    </div>

    
  );
};

export default PlayArea;
