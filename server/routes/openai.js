import express from "express";
import { getPlaylistRecommendation } from "../controllers/openai.js";

const router = express.Router();

router.post("/recplaylist", getPlaylistRecommendation);

export default router;