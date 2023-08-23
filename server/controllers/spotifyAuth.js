import querystring from "querystring";
import fetch from "node-fetch";

export const loginSpotify = (req, res) => {
    const client_id = process.env.SPOTIFY_CLIENT_ID;

    const state = "idontknow";
    const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private streaming user-modify-playback-state';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            state: state
        }));
}

export const getAccessToken = async (req, res) => {
    const code = req.query.code || null;

    try {
        const details = {
            "code": code,
            "redirect_uri": process.env.SPOTIFY_REDIRECT_URI,
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
            let { access_token, refresh_token } = responseJSON;
            console.log(responseJSON);

            res.redirect(`${process.env.CLIENT_URL}?access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}`);
        }

    } catch (err) {
        console.log(err);
    }
}

export const refreshToken = async (req, res) => {
    let refresh_token = req.query.refresh_token;

    try {
        const details = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token
        };

        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        };
        formBody = formBody.join("&");

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
            }
        })

        if (response.ok) {
            let responseJSON = await response.json();
            let { access_token } = responseJSON;
            res.json({access_token});
        }
    } catch (err) {
        console.log(err);
    }
}   