import "./Playlist.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { playTracks } from "../../requests/spotify.js";

const Playlist = (props) => {
    const handleClickSong = (index, trackID) => {
        props.setActiveSongID(trackID)
        // playPlaylist(props.token, props.deviceID, props.activePlaylist.playlistURI, index);
        playTracks(
            props.token,
            props.deviceID,
            props.activePlaylist.tracks.map((track) => track.uri),
            index
        );
        // transferPlaybackHere(props.token, device_id);
    };

    const getTrackClassName = (trackID) => {
        if (props.activeSongID === trackID) {
            return "activeTrack";
        } else {
            return "inactiveTrack";
        }
    };

    return (
        <div className="Playlist">
            {props.activePlaylist.tracks.map((track, index) => {
                return (
                    <div key={`${index}: ${track.uri}`}>
                        <div
                            className={getTrackClassName(track.id)}
                            onClick={() => handleClickSong(index, track.id)}
                        >
                            <div className="play">
                                <PlayArrowIcon fontSize="large" />
                            </div>
                            <div className="songInfo">
                                <img src={track.cover} alt="song cover" />
                                <div className="trackInfo">
                                    <p className="artistInfo unselectable">
                                        {track.trackName}
                                    </p>
                                    <p className="songNameInfo unselectable">
                                        {track.artist}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="songBreak"></hr>
                    </div>
                );
            })}
        </div>
    );
};

export default Playlist;
