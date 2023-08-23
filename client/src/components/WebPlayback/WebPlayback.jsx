import React, { useState, useEffect } from "react";
import { resume, pause, skipNext, skipPrev } from "../../requests/spotify.js";
import { refreshToken } from "../../requests/spotify.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSpotifyToken } from "../../state/index.js";

import "./WebPlayback.css";
import PlayCircle from "../../assets/PlayCircle.svg";
import PauseCircle from "../../assets/PauseCircle.svg";


const WebPlayback = (props) => {
    // const [player, setPlayer] = useState(undefined);
    const [is_paused, setIsPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [currentDeviceID, setCurrentDeviceID] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleFunctionClick = async () => {
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
    };

    const playOrPause = () => {
        if (is_paused) {
            resume(props.token.access_token, currentDeviceID);
        } else {
            pause(props.token.access_token, currentDeviceID);
        }
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "Web Playback SDK",
                getOAuthToken: (cb) => {
                    cb(props.token.access_token);
                },
                volume: 0.1,
            });

            // setPlayer(player);

            player.addListener("ready", ({ device_id }) => {
                console.log("Ready with Device ID", device_id);
                props.setDeviceID(device_id);
                setCurrentDeviceID(device_id);
            });

            player.addListener("not_ready", ({ device_id }) => {
                console.log("Device ID has gone offline", device_id);
            });

            player.addListener("player_state_changed", (state) => {
                if (!state) {
                    return;
                }

                if (state.track_window.current_track) {
                  props.setCurrentTrack(state.track_window.current_track)
                }
                setIsPaused(state.paused);

                player.getCurrentState().then((state) => {
                    !state ? setActive(false) : setActive(true);
                });
            });

            player.connect();
        };
    }, []);

    if (!is_active || !props.currentTrack) {
        return (
            <>
                <div className="WebPlayback">
                    <div className="main-wrapper">
                        <b> </b>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="WebPlayback">
                    <div className="main-wrapper">
                        {is_paused ? (
                            <img
                                alt="play"
                                src={PlayCircle}
                                className="playButton"
                                fontSize="large"
                                onClick={async () => {
                                    await handleFunctionClick();
                                    playOrPause();
                                }}
                            />
                        ) : (
                            <img
                                alt="pause"
                                src={PauseCircle}
                                className="pauseButton"
                                onClick={async () => {
                                    await handleFunctionClick();
                                    playOrPause();
                                }}
                            />
                        )}
                        {/* <img
              src={current_track.album.images[0].url}
              className="now-playing__cover"
              alt=""
            /> */}

                        <div className="now-playing__side">
                            <div className="now-playing__name">
                                {props.currentTrack.name}
                            </div>
                            <div className="now-playing__artist">
                                {props.currentTrack.artists[0].name}
                            </div>
                        </div>
                        <div className="playbackButtons">
                            <button
                                className="btn-spotify"
                                onClick={async () => {
                                    await handleFunctionClick();
                                    skipPrev(
                                        props.token.access_token,
                                        currentDeviceID
                                    );


                                }}
                            >
                                &lt;&lt;
                            </button>

                            <button
                                className="btn-spotify"
                                onClick={async () => {
                                    await handleFunctionClick();
                                    skipNext(
                                        props.token.access_token,
                                        currentDeviceID
                                    );

                                }}
                            >
                                &gt;&gt;
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default WebPlayback;
