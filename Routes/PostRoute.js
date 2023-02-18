import express from "express";
import { createPost, deletPost, getPost, likeAndDislikePost, timelinePost, updatePost } from "../Controllers/PostController.js";
const router = express.Router();

router.post('/',createPost);
router.get("/:id",getPost);
router.put("/:id",updatePost);
router.delete("/:id",deletPost);
router.put("/:id/like",likeAndDislikePost);
router.get('/:id/timeline',timelinePost)

export default router;