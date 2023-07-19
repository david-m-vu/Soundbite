import OpenAI from "../requests/openai.js";
import { getTrackURIs, getUserID, createPlaylist, updatePlaylist } from "../requests/spotify.js";

export const generateGPTRecPlaylist = async (req, res) => {
    const openAI = new OpenAI(process.env.OPENAI_API_KEY);
    const recommendationsList = await openAI.getPlaylistRecommendation(req.body.message, 1)

    let access_token = req.body.access_token;

    const trackURIs = await getTrackURIs(access_token, recommendationsList);
    const userID = await getUserID(access_token);

    const [playlistID, playlistURI] = await createPlaylist(access_token, userID, req.body.message);
    const snapshotID = await updatePlaylist(access_token, playlistID, trackURIs);
    res.status(200).json({playlistID, playlistURI});
}
