import "./SpotifyConnect.css";
import NavBar from "../../components/NavBar/NavBar.jsx";
import CheckMark from "../../assets/Vector.svg";

import { useNavigate } from "react-router-dom";

// const backendBaseURL = "https://soundbite-backend.onrender.com";
const backendBaseURL = "http://localhost:3001";

const SpotifyConnect = (props) => {
    const navigate = useNavigate();

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
