import express from "express";
import { getUser, getUserPlaylists, deleteUserPlaylist } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id", verifyToken, getUser);
router.post("/:id/playlists", verifyToken, getUserPlaylists);
router.delete("/:id/playlists/:playlist_id", verifyToken, deleteUserPlaylist);


export default router;