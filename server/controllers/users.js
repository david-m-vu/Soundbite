import User from "../models/User.js";
import Playlist from "../models/Playlist.js"

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPlaylists = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const playlists = user.playlists;
        const formattedPlaylists = playlists.map(({ _id, name, spotifyID, uri, tracks}) => {
            return { _id, name, spotifyID, uri, tracks}
        })
        res.status(200).json(formattedPlaylists);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const deleteUserPlaylist = async (req, res) => {
    try {
        const { id, playlist_id } = req.params;
        const user = await User.findById(id);

        user.playlists = user.playlists.filter((playlist) => {
            return playlist._id.toString() !== playlist_id;
        })

        await User.findByIdAndUpdate(id, {playlists: user.playlists}, { new: true});
        await Playlist.findByIdAndDelete(playlist_id)

        res.status(200).json(user.playlists);
        
    } catch (err) {
        console.log(err);
    }
}