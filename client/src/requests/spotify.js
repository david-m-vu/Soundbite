const spotifyBaseURL = "https://api.spotify.com/v1";

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
      authorization: `Bearer ${access_token}`,
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
  await fetch(`${spotifyBaseURL}/me/player/next?device_id=${device_id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: "POST",
  });
};

export const skipPrev = async (access_token, device_id) => {
  await fetch(`${spotifyBaseURL}/me/player/previous?device_id=${device_id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: "POST",
  });
};
