import express from "express";
import {
  addComment,
  createNewPost,
  deletePost,
  downVotePost,
  editPost,
  getPost,
  upVotePost,
} from "../controllers/postController.js";
import validateToken from "../middlewares/authMiddleware.js";
import upload from "../middlewares/imageUploaderMiddleware.js";

const router = express.Router();

// Get post
router.get("/:id", getPost);

// Create post
router.post("/", validateToken, upload.single("image"), createNewPost);

// Edit post
router.put("/:id", validateToken, editPost);

// Delete post
router.delete("/:id", validateToken, deletePost);

// Upvote post
router.put("/upvote/:id", validateToken, upVotePost);

// Downvote post
router.put("/downvote/:id", validateToken, downVotePost);

// Add comment to post
// router.put("/comment/:id", validateToken, addComment);

// Delete comment
// router.put("comment/:postId/:commentId", validateToken, addComment);

export default router;
