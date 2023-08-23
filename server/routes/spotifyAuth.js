import express from "express";
import { loginSpotify, getAccessToken, refreshToken } from "../controllers/spotifyAuth.js";

const router = express.Router();

router.get('/login', loginSpotify);
router.get("/callback", getAccessToken);
router.get("/refresh_token", refreshToken)

export default router;