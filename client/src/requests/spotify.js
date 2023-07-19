export const loginSpotify = async () => {
    const client_id = "bb35f0a5f4a446a78f8d55020a4d5ece";
    const redirect_uri = 'http://localhost:3000';

    const state = "H@IH(*&HQD&*(H@)#*D";
    const scope = 'user-read-private user-read-email playlist-modify-public';

    (`https://accounts.spotify.com/authorize?response_type=code&client_id=
    ${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`);

  }