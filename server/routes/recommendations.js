import express from "express";
import { generateGPTRecPlaylist } from "../controllers/recommendations.js";

const router = express.Router();

router.post("/", generateGPTRecPlaylist)

export default router;