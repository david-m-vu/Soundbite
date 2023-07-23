import mongoose from "mongoose";

const playlistSchema = mongoose.Schema(
    {
        name: {
            type: String
        },
        spotifyID: {
            type: String,
            required: true
        },
        uri: {
            type: String,
            required: true
        },
        tracks: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;