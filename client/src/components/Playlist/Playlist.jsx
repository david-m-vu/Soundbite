import "./Playlist.css";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { playTracks } from "../../requests/spotify.js"


const Playlist = (props) => {    
    const handleClickSong = (index) => {
        props.setActiveSongIndex(index);
        // playPlaylist(props.token, props.deviceID, props.activePlaylist.playlistURI, index);
        playTracks(props.token, props.deviceID, props.activePlaylist.tracks.map((track) => track.uri), index);
        // transferPlaybackHere(props.token, device_id);
        
    }

    const getTrackClassName = (index) => {
        if (props.activeSongIndex === index) {
            return "activeTrack"
        } else {
            return "inactiveTrack"
        }
    }

    return (
        <div className="Playlist">
            <h1>{props.activePlaylist.name}</h1>
            {props.activePlaylist.tracks.map((track, index) => {
                return (
                    <div key={track.uri} className={getTrackClassName(index)} onClick={() => handleClickSong(index)}>
                        <div className="songInfo">
                            <img src={track.cover} alt="song cover" />
                            <div className="trackInfo">
                                <h3 className="unselectable">{track.trackName}</h3>
                                <p className="unselectable">{track.artist}</p>
                            </div>
                        </div>
                        <div className="play">
                            <PlayArrowIcon fontSize="large" />
                        </div>

                    </div>
                )
            })}

        </div>
    )
}

export default Playlist;