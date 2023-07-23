const backendBaseURL = "https://soundbite-backend.onrender.com"

export const generateGPTRecPlaylist = async (userID, token, spotifyToken, activityInput, durationInput) => {    
    const gptResponse = await fetch(`${backendBaseURL}/recommendations/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            activity: activityInput,
            duration: durationInput
        })
    })

    const gptRec = (await gptResponse.json()).context;
    
    const playlistResponse = await fetch(`${backendBaseURL}/recommendations/add/${userID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            recommendation: gptRec,
            spotifyToken,
            playlistName: activityInput
        }),
    })

    if (playlistResponse.ok) {
        const playlist = await playlistResponse.json();
        return {
            ...playlist
        };
    }
}