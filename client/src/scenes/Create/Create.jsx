import "./Create.css";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { generateGPTRecPlaylist } from "../../requests/recommendations.js";
import { setPlaylists } from "../../state/index.js";
import { useNavigate } from "react-router";

import NavBar from "../../components/NavBar/NavBar.jsx";

const elipses = ["", ".", "..", "..."];

const isPositiveInteger = (str) => {
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0;
};

const Create = (props) => {
    const [currentCreationStep, setCurrentCreationStep] = useState(0);
    const [steps] = useState([0, 1, 2, 3]);

    const [playlistNameInput, setPlaylistNameInput] = useState("");
    const [themeInput, setThemeInput] = useState("");

    const [songsInput, setSongsInput] = useState("");
    const [artistsInput, setArtistsInput] = useState("");
    const [genreInput, setGenreInput] = useState("");

    const [durationInput, setDurationInput] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [currentElipsesIndex, setCurrentElipsesIndex] = useState(2);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                setCurrentElipsesIndex((prev) => (prev + 1) % 4);
            }, 500);
        }
    }, [isLoading, currentElipsesIndex]);

    const goNextStep = () => {
        if (currentCreationStep < 2) {
            setCurrentCreationStep((prev) => prev + 1);
        } else if (currentCreationStep === 2) {
            setCurrentCreationStep((prev) => prev + 1);
            handleSubmitGPTInput();
        }
    };

    const goPrevStep = () => {
        if (currentCreationStep !== 0) {
            setCurrentCreationStep((prev) => prev - 1);
        } else {
            navigate("/main")
        }
    };

    const getDisableNextCondition = () => {
        if (currentCreationStep === 0) {
            return playlistNameInput && themeInput;
        } else if (currentCreationStep === 1) {
            return true;
        } else if (currentCreationStep === 2) {
            return isPositiveInteger(durationInput);
        }
    };

    const handlePlaylistNameInputChange = (e) => {
        setPlaylistNameInput(e.target.value);
    };

    const handleThemeInputChange = (e) => {
        setThemeInput(e.target.value);
    };

    const handleSongsInputChange = (e) => {
        setSongsInput(e.target.value);
    }

    const handleArtistsInputChange = (e) => {
        setArtistsInput(e.target.value);
    }

    const handleGenreInputChange = (e) => {
        setGenreInput(e.target.value);
    }

    const handleDurationInputChange = (e) => {
        setDurationInput(e.target.value);
    };

    const handleSubmitGPTInput = async () => {
        setIsLoading(true);
        let inputsObj = {
            playlistName: playlistNameInput,
            theme: themeInput,
            songs: songsInput,
            artists: artistsInput,
            genre: genreInput,
            duration: durationInput,
        }
        let newPlaylist = await generateGPTRecPlaylist(
            props.user._id,
            props.token,
            props.user.spotifyToken,
            inputsObj
        );

        //   setActivePlaylist(newPlaylist);
        //   setActivePlaylistIndex(props.user.playlists.length);
        setThemeInput("");
        setDurationInput("");

        dispatch(
            setPlaylists({
                playlists: [...props.user.playlists, newPlaylist],
            })
        );
        setIsLoading(false);
        navigate("../main");
    };

    const getStepIndicatorClassName = (indicatorStep) => {
        if (indicatorStep === currentCreationStep) {
            return "activeStepIndicator";
        } else {
            return "inactiveStepIndicator";
        }
    };

    return (
        <div className="Create">
            <NavBar />

            <div className="content">
                {!isLoading && (
                    <div className="stepIndicators">
                        {steps.map((step) => {
                            return (
                                <div
                                    key={step}
                                    className={getStepIndicatorClassName(step)}
                                />
                            );
                        })}
                    </div>
                )}
                {currentCreationStep === 0 && (
                    <div className="name-theme">
                        <div className="namePlaylist">
                            <label
                                htmlFor="namePlaylistInput"
                                className="inputLabel"
                            >
                                Create your first playlist
                            </label>
                            <input
                                id="namePlaylistInput"
                                className="createFormInput"
                                placeholder="Name your playlist"
                                onChange={handlePlaylistNameInputChange}
                                value={playlistNameInput}
                                type="text"
                            ></input>
                        </div>
                        <div className="themePlaylist">
                            <label
                                htmlFor="themePlaylistInput"
                                className="inputLabel"
                            >
                                What's the theme - Keywords please
                            </label>
                            <input
                                id="themePlaylistInput"
                                className="createFormInput"
                                placeholder="Italian pizza night"
                                onChange={handleThemeInputChange}
                                value={themeInput}
                                type="text"
                            ></input>
                        </div>
                    </div>
                )}
                {currentCreationStep === 1 && (
                    <div className="songs-artists-genre">
                        <div className="listFavoriteThings">
                            <label htmlFor="songsInput" className="inputLabel">
                                In order to give you songs that you love, enter
                                some songs or artists you love. You could even
                                specify a genre.
                            </label>
                            <input
                                id="songsInput"
                                className="createFormInput"
                                placeholder="Songs"
                                onChange={handleSongsInputChange}
                                value={songsInput}
                                type="text"
                            />
                            <input
                                id="artistsInput"
                                className="createFormInput"
                                placeholder="Artists"
                                onChange={handleArtistsInputChange}
                                value={artistsInput}
                                type="text"
                            />
                            <input
                                id="genreInput"
                                className="createFormInput"
                                placeholder="Genre"
                                onChange={handleGenreInputChange}
                                value={genreInput}
                                type="text"
                            />
                        </div>
                    </div>
                )}
                {currentCreationStep === 2 && (
                    <div className="duration-tags">
                        <div className="duration">
                            <label
                                htmlFor="durationInput"
                                className="inputLabel"
                            >
                                How long do you wish it to be?
                            </label>
                            <input
                                id="durationInput"
                                className="createFormInput"
                                placeholder="120 (minutes)"
                                onChange={handleDurationInputChange}
                                value={durationInput}
                                type="text"
                            />
                        </div>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="loading">
                    <div className="loadingMessage">
                        Mixing Tape
                        <p className="elipses">
                            {elipses[currentElipsesIndex]}
                        </p>
                    </div>
                </div>
            )}

            {!isLoading && (
                <div className="navigateButtons">
                    <button
                        id="backButton"
                        className="nextButton standardButton"
                        onClick={() => goPrevStep()}
                    >
                        Back
                    </button>

                    {getDisableNextCondition() ? (
                        <button
                            className="nextButton standardButton"
                            onClick={() => goNextStep()}
                        >
                            Next
                        </button>
                    ) : (
                        <button className="disabledNextButton">Next</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Create;
