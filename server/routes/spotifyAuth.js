import express from "express";
import { loginSpotify, getAccessToken, sendToken } from "../controllers/spotifyAuth.js";

const router = express.Router();

router.get('/login', loginSpotify);
router.get("/callback", getAccessToken);
router.get("/token", sendToken)

export default router;