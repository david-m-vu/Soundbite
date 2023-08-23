import "./Playlist.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { playTracks, refreshToken } from "../../requests/spotify.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSpotifyToken } from "../../state/index.js";

const Playlist = (props) => {
    let navigate = useNavigate();
    let dispatch = useDispatch();

    const handleClickSong = async (index, trackID) => {
        if (props.token) {
            let refresh_token = props.token.refresh_token;
            let new_access_token = await refreshToken(refresh_token);

            dispatch(
                setSpotifyToken({
                    spotifyToken: {
                        access_token: new_access_token,
                        refresh_token,
                        dateInitialized: Date.now(),
                    },
                })
            );
        } else {
            navigate("/connect");
        }

        // playPlaylist(props.token, props.deviceID, props.activePlaylist.playlistURI, index);
        playTracks(
            props.token.access_token,
            props.deviceID,
            props.activePlaylist.tracks.map((track) => track.uri),
            index
        );
        // transferPlaybackHere(props.token, device_id);

        props.setPlaylistPlaying(props.activePlaylist);
    };

    const getTrackClassName = (track) => {
        if (
            props.playlistPlaying &&
            props.playlistPlaying._id === props.activePlaylist._id &&
            props.currentTrack &&
            props.currentTrack.id === track.id
        ) {
            return "activeTrack";
        } else {
            return "inactiveTrack";
        }
    };

    return (
        <div className="Playlist">
            {props.activePlaylist.tracks.map((track, index) => {
                return (
                    <div className="songSection" key={`${index}: ${track.uri}`}>
                        <div
                            className={getTrackClassName(track)}
                            onClick={async () =>
                                await handleClickSong(index, track.id)
                            }
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
