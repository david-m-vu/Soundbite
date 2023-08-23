import "./SpotifyConnect.css";
import NavBar from "../../components/NavBar/NavBar.jsx";
import CheckMark from "../../assets/Vector.svg";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSpotifyToken } from "../../state/index.js"

const backendBaseURL = process.env.REACT_APP_BACKEND_BASE_URL;

const SpotifyConnect = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (window.location.search === "") {
            return;
        }

        let access_token = "";
        let refresh_token = "";

        let searchParams = new URLSearchParams(decodeURIComponent(window.location.search));
        for (const [key, value] of searchParams) {
            if (key === "access_token") {
                access_token = value;
            } else if (key === "refresh_token") {
                refresh_token = value;
            }
        }

        dispatch(setSpotifyToken({ spotifyToken: {access_token, refresh_token, dateInitialized: Date.now()} }));
                
        // get rid of search params in url
        let url = new URL(window.location.href);
        url.searchParams.delete("access_token");
        url.searchParams.delete("refresh_token");
        window.history.replaceState(window.history.state, "", url.href);
        
    }, [dispatch])

    return (
        <div className="SpotifyConnect">
            <NavBar />
            <a href={`${backendBaseURL}/spotify/login`}>
                <button className="connectSpotifyButton standardButton">
                    Connect to Spotify
                </button>
            </a>
            {props.user.spotifyToken && <img src={CheckMark} alt="checkmark" />}
            <div className="continueButtons">
                {props.user.spotifyToken ? (
                    <button
                        className="nextButton standardButton"
                        onClick={() => navigate("../main")}
                    >
                        Next
                    </button>
                ) : (
                    <button className="disabledNextButton">Next</button>
                )}
                {props.user.spotifyToken ? (
                    <p className="disabledSkipButton">Skip</p>
                ) : (
                    <p
                        onClick={() => navigate("../main")}
                        className="skipButton"
                    >
                        Skip
                    </p>
                )}
            </div>
        </div>
    );
};

export default SpotifyConnect;
