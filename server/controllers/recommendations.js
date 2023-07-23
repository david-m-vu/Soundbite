import OpenAI from "../requests/openaiGPT.js";
import { getTracks, getUserID, createPlaylist, updatePlaylist } from "../requests/spotify.js";
import { parseLineSeparatedList } from "../util/parseText.js";
import User from "../models/User.js";
import Playlist from "../models/Playlist.js";

export const askGPT = async (req, res) => {
    const {
        activity,
        duration,
        userResponse // for future chat functionality
    } = req.body;
    
    const openAI = new OpenAI(process.env.OPENAI_API_KEY);
    const recommendation = await openAI.getPlaylistRecommendation(activity, duration, 1, userResponse);
    res.status(200).json({context: recommendation});
}


export const generateRecPlaylist = async (req, res) => {
    const { recommendation, spotifyToken, playlistName } = req.body;

    let recommendationsList = parseLineSeparatedList(recommendation);
    const tracks = await getTracks(spotifyToken, recommendationsList);
    const userID = await getUserID(spotifyToken);


    const [playlistID, playlistURI] = await createPlaylist(spotifyToken, userID, `${playlistName} (gpt generated)`);
    await updatePlaylist(spotifyToken, playlistID, tracks);

    const { id } = req.params;
    const user = await User.findById(id);

    const newPlaylist = new Playlist({
        name: playlistName,
        spotifyID: playlistID,
        uri: playlistURI,
        tracks: tracks
    })
    await newPlaylist.save();
    user.playlists.push(newPlaylist);

    await User.findByIdAndUpdate(id, {playlists: user.playlists}, { new: true });

    res.status(200).json(newPlaylist);
}

