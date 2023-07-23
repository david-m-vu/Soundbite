import querystring from "querystring";
import fetch from "node-fetch";

const redirect_uri = 'https://soundbite-backend.onrender.com/spotify/callback';
const frontendURL = "https://david-m-vu.github.io/Soundbite/#/main"
let access_token = "";

export const loginSpotify = (req, res) => {
    const client_id = process.env.SPOTIFY_CLIENT_ID;

    const state = "idontknow";
    const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private streaming user-modify-playback-state';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
}

export const getAccessToken = async (req, res) => {
    const code = req.query.code || null;

    try {
        const details = {
            "code": code,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code"
        }

        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
            },
        })

        if (response.ok) {
            let responseJSON = await response.json();
            access_token = responseJSON.access_token;

            res.redirect(`${frontendURL}`);
        }

    } catch (err) {
        console.log(err);
    }
}

export const sendToken = (req, res) => {
    // implement user auth later
    res.json({ access_token: access_token });
}