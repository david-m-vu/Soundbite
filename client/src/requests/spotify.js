const spotifyBaseURL = "https://api.spotify.com/v1";
const backendBaseURL = process.env.REACT_APP_BACKEND_BASE_URL;

// export const savePlaylist = async (access_token, tracks) => {

// }

export const refreshToken = async (refresh_token) => {
  try {
    const response = await fetch(`${backendBaseURL}/spotify/refresh_token?refresh_token=${refresh_token}`);
    if (response.ok) {
      const responseJSON = await response.json();
      const { access_token } = responseJSON;
      return access_token;
    }
  } catch (err) {
    console.log(err);
  }
}

export const getPlaylistTrackURIs = async (access_token, playlistID) => {
  try {
    const response = await fetch(`${spotifyBaseURL}/playlists/${playlistID}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (response.ok) {
      let responseJSON = await response.json();

      let trackURIs = responseJSON.tracks.items.map((item) => {
        return item.track.uri;
      });

      return trackURIs;
    }
  } catch (err) {
    console.log(err);
  }
};

export const transferPlaybackHere = (access_token, device_id) => {
  fetch(`${spotifyBaseURL}/me/player`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_ids: [device_id],
      play: true,
    }),
  });
};

export const playPlaylist = async (
  access_token,
  device_id,
  context_uri,
  offset
) => {
  await fetch(`${spotifyBaseURL}/me/player/play?device_id=${device_id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: "PUT",
    body: JSON.stringify({
      context_uri,
      offset: {
        position: offset,
      },
    }),
  });
};

export const playTracks = async (
  access_token,
  device_id,
  trackURIs,
  offset
) => {
  await fetch(`${spotifyBaseURL}/me/player/play?device_id=${device_id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: "PUT",
    body: JSON.stringify({
      uris: trackURIs,
      offset: {
        position: offset,
      },
    }),
  });
};

export const resume = async (access_token, device_id) => {
  await fetch(`${spotifyBaseURL}/me/player/play?device_id=${device_id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: "PUT",
  });
};

export const pause = async (access_token, device_id) => {
  await fetch(`${spotifyBaseURL}/me/player/pause?device_id=${device_id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: "PUT",
  });
};

export const skipNext = async (access_token, device_id) => {
  try {
    await fetch(`${spotifyBaseURL}/me/player/next?device_id=${device_id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      method: "POST",
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const skipPrev = async (access_token, device_id) => {
  try {
    await fetch(`${spotifyBaseURL}/me/player/previous?device_id=${device_id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      method: "POST",
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const validateSpotifyToken = (token, expirationTime) => {
  let timeDifference = Date.now() - token.dateInitialized;
  if (timeDifference / 1000 >= expirationTime) {
      return false;
  } else {
      return true;
  }
}
