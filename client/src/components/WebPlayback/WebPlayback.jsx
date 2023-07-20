import React, { useState, useEffect } from 'react';
import { play, transferPlaybackHere} from "../../requests/spotify.js"
import "./WebPlayback.css";

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

const WebPlayback = (props) => {
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);


    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.2
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                if (props.playlistURI) {
                    play(props.token, device_id, props.playlistURI);
                    // transferPlaybackHere(props.token, device_id);
                }
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => {
                if (!state) {
                    return;
                }
                console.log(state);


                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                });

            }));

            player.connect();
        };


    }, []);

    if (!is_active) {
        return (
            <>
                <div className="WebPlayback">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="WebPlayback">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>
                            <div className="playbackButtons">
                                <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                    &lt;&lt;
                                </button>

                                <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                    {is_paused ? "PLAY" : "PAUSE"}
                                </button>

                                <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                    &gt;&gt;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback