import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

const spotifyBaseURL = "https://api.spotify.com/v1";

export const getTracks = async (access_token, songList) => {  
    let tracks = [];
    for (let i = 0; i < songList.length; i++) {
        try {
            const response = await fetch(`${spotifyBaseURL}/search?q=${songList[i]}&type=track`, {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })

            if (response.ok) {
                let responseJSON = await response.json();
                let cover = responseJSON.tracks.items[0].album.images[0].url;
                let trackName = responseJSON.tracks.items[0].name;
                let artist = responseJSON.tracks.items[0].artists[0].name;
                let uri = responseJSON.tracks.items[0].uri;
                let id = responseJSON.tracks.items[0].id;

                tracks.push({uid: uuidv4(), id, cover, trackName, artist, uri});
            }

        } catch (err) {
            console.log(err);
        } 
    }

    return tracks;
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
                public: false
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

export const updatePlaylist = async (access_token, playlistID, tracksInfo) => {
    try {
        tracksInfo = tracksInfo.slice(0, 100);
        console.log(tracksInfo.length);
        let response = await fetch(`${spotifyBaseURL}/playlists/${playlistID}/tracks`, {
            method: "PUT",
            body: JSON.stringify({
                uris: tracksInfo.map((track) => {
                    return track.uri;
                })
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