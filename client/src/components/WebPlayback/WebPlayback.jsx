import React, { useState, useEffect } from "react";
import { resume, pause, skipNext, skipPrev } from "../../requests/spotify.js";
import "./WebPlayback.css";
import PlayCircle from "../../assets/PlayCircle.svg";
import PauseCircle from "../../assets/PauseCircle.svg";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

const WebPlayback = (props) => {
  // const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  const [currentDeviceID, setCurrentDeviceID] = useState("");

  const { token, setDeviceID } = props;

  const playOrPause = () => {
    if (is_paused) {
      resume(token, currentDeviceID);
    } else {
      pause(token, currentDeviceID);
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
          cb(token);
        },
        volume: 0.2,
      });

      // setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceID(device_id);
        setCurrentDeviceID(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, [setDeviceID, token]);

  if (!is_active || !current_track) {
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
                onClick={() => {
                  playOrPause();
                }}
              />
            ) : (
              <img
                alt="pause"
                src={PauseCircle}
                className="pauseButton"
                onClick={() => {
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
              <div className="now-playing__name">{current_track.name}</div>
              <div className="now-playing__artist">
                {current_track.artists[0].name}
              </div>
            </div>
            <div className="playbackButtons">
              <button
                className="btn-spotify"
                onClick={() => {
                  skipPrev(token, currentDeviceID);
                }}
              >
                &lt;&lt;
              </button>

              <button
                className="btn-spotify"
                onClick={() => {
                  skipNext(token, currentDeviceID);
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
