import express from "express";
import { generateRecPlaylist, askGPT } from "../controllers/recommendations.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/ask", askGPT)
router.post("/add/:id", verifyToken, generateRecPlaylist)

export default router;