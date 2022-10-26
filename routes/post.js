import express from "express";
import {
  addComment,
  createNewPost,
  deletePost,
  downVotePost,
  editPost,
  getPost,
  getTimelinePosts,
  getUserPosts,
  upVotePost,
} from "../controllers/postController.js";
import validateToken from "../middlewares/authMiddleware.js";
import upload from "../middlewares/imageUploaderMiddleware.js";

const router = express.Router();

// Get post
router.get("/find/:id", getPost);

// Create post
router.post("/create", validateToken, upload.single("image"), createNewPost);

// Edit post
router.put("/update/:id", validateToken, editPost);

// Delete post
router.delete("/delete/:id", validateToken, deletePost);

// Upvote post
router.put("/upvote/:id", validateToken, upVotePost);

// Downvote post
router.put("/downvote/:id", validateToken, downVotePost);

// Add comment to post
// router.put("/comment/:id", validateToken, addComment);

// Delete comment
// router.put("comment/:postId/:commentId", validateToken, addComment);

// Get timeline posts
router.get("/timeline", validateToken, getTimelinePosts);

// Get posts for specific user
router.get("/:username", getUserPosts);

export default router;
