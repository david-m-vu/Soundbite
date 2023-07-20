import OpenAI from "../requests/openai.js";
import { getTracksInfo, getUserID, createPlaylist, updatePlaylist } from "../requests/spotify.js";

export const generateGPTRecPlaylist = async (req, res) => {
    const openAI = new OpenAI(process.env.OPENAI_API_KEY);
    const recommendationsList = await openAI.getPlaylistRecommendation(req.body.activity, req.body.duration, 1)
    console.log(recommendationsList);

    let access_token = req.body.access_token;

    const tracksInfo = await getTracksInfo(access_token, recommendationsList);
    const userID = await getUserID(access_token);

    const [playlistID, playlistURI] = await createPlaylist(access_token, userID, req.body.activity);
    await updatePlaylist(access_token, playlistID, tracksInfo);
    res.status(200).json({playlistID, playlistURI, tracksInfo});
}
