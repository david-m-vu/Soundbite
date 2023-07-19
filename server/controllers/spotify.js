import querystring from "querystring";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";

const redirect_uri = 'http://localhost:3001/spotify/callback';

export const loginSpotify = (req, res) => {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    
    const state = "idontknow";
    const scope = 'user-read-private user-read-email playlist-modify-public';

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
    const state = req.query.state || null;

    try {
        if (state === null) {
            res.redirect('/#' +
              querystring.stringify({
                error: 'state_mismatch'
              }));
          } else {
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
                let accessToken = responseJSON.access_token;

                let encodedAccessToken = encodeURIComponent(accessToken);
                const token = jwt.sign({accessToken: accessToken}, process.env.JWT_SECRET);

                res.redirect(`http://localhost:3000/?access_token=${encodedAccessToken}`);
            }
          }
    } catch (err) {
        console.log(err);
    }
}

 