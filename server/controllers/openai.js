import OpenAI from "../requests/openai.js";

export const getPlaylistRecommendation = async (req, res) => {
    const openAI = new OpenAI(process.env.OPENAI_API_KEY);
    const response = await openAI.getPlaylistRecommendation(req.body.message, 1)

    res.status(200).json({content: response});
}