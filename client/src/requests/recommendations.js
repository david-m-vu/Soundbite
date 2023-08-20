// const backendBaseURL = "https://soundbite-backend.onrender.com"
const backendBaseURL = "http://localhost:3001";

export const generateGPTRecPlaylist = async (userID, token, spotifyToken, inputsObj) => {    
    const { playlistName, theme, songs, artists, genre, duration } = inputsObj;
    console.log(inputsObj);
    const gptResponse = await fetch(`${backendBaseURL}/recommendations/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            theme,
            songs,
            artists,
            genre,
            duration
        })
    })

    // get the list of songs to connect to spotify later
    const gptRec = (await gptResponse.json()).context;
    
    // save to spotify and to the database
    const playlistResponse = await fetch(`${backendBaseURL}/recommendations/add/${userID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            recommendation: gptRec,
            spotifyToken,
            playlistName,
        }),
    })

    if (playlistResponse.ok) {
        const playlist = await playlistResponse.json();
        return {
            ...playlist
        };
    }
}