import express from "express";
import { loginSpotify, getAccessToken } from "../controllers/spotify.js";

const router = express.Router();

router.get('/login', loginSpotify);
router.get("/callback", getAccessToken);

export default router;