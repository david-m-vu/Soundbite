const spotifyBaseURL = "https://api.spotify.com/v1";
import fetch from "node-fetch";

export const getTrackURIs = async (access_token, songList) => {  
    let trackURIs = [];
    for (let i = 0; i < songList.length; i++) {
        try {
            const response = await fetch(`${spotifyBaseURL}/search?q=${songList[i]}&type=track`, {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })

            if (response.ok) {
                let responseJSON = await response.json();
                trackURIs.push(responseJSON.tracks.items[0].uri);
            }

        } catch (err) {
            console.log(err);
        } 
    }

    return trackURIs;
}

export const getUserID = async (access_token) => {
    try {
        const response = await fetch(`${spotifyBaseURL}/me`, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });
        if (response.ok) {
            let responseJSON = await response.json();
            return responseJSON.id;
        }
    } catch (err) {
        console.log(err);
    }
}

// returns the playlist ID of the created playlist
export const createPlaylist = async (access_token, userID, playlistName) => {
    try {
        let response = await fetch(`${spotifyBaseURL}/users/${userID}/playlists`, {
            method: "POST",
            body: JSON.stringify({
                name: playlistName,
            }),
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })

        if (response.ok) {
            let responseJSON = await response.json();
            return [responseJSON.id, responseJSON.uri];
        }

    } catch (err) {
        console.log(err);
    }
}

export const updatePlaylist = async (access_token, playlistID, trackURIs) => {
    try {
        let response = await fetch(`${spotifyBaseURL}/playlists/${playlistID}/tracks`, {
            method: "PUT",
            body: JSON.stringify({
                uris: trackURIs
            }),
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })

        if (response.ok) {
            let responseJSON = await response.json();
            return responseJSON.snapshot_id;
        }

    } catch (err) {
        console.log(err);
    }
}