import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    playlists: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setSpotifyToken: (state, action) => {
            state.user.spotifyToken = action.payload.spotifyToken
        },
        setPlaylists: (state, action) => {
            state.user.playlists = action.payload.playlists;
        },
        setPlaylist: (state, action) => {
            const updatedPlaylists = state.playlists.map((playlist) => {
                if (playlist._id === action.payload.playlist_id) {
                    return action.payload.playlist; 
                }
                return playlist;
            })
            state.playlists = updatedPlaylists;
        }
    }
})

export const { setLogin, setLogout, setSpotifyToken, setPlaylists, setPlaylist } = authSlice.actions;
export default authSlice.reducer;