// TODO: Implement commenting logic for the api

import PostModel from "../models/Post.js";

/* Get Post Info
================ */
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: "post not found" });

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Create New Post
================== */
export const createNewPost = async (req, res) => {
  const { username } = req.user;

  const postData = {
    username,
    ...req.body,
  };

  const post = new PostModel(postData);

  try {
    await post.save();
    return res.status(200).json({ message: "post created successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Edit Post
============ */
export const editPost = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  try {
    const post = await PostModel.findById(id);

    if (!post) return res.status(404).json({ message: "post not found" });

    if (post.username !== username)
      return res
        .status(403)
        .json({ message: "not allowed to delete others' posts" });

    await post.updateOne({ $set: req.body });

    return res.status(200).json({ message: "post updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Delete Post
============== */
export const deletePost = async (req, res) => {
  const { username } = req.user;
  const { id } = req.params;

  try {
    const post = await PostModel.findById(id);

    if (!post) return res.status(404).json({ message: "post not found" });

    if (post.username !== username)
      return res
        .status(403)
        .json({ message: "not allowed to delete others' posts" });

    await PostModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "post deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* UpVote a Post
================ */
export const upVotePost = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  try {
    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: "post not found" });

    if (!post.upVotes.includes(username)) {
      await post.updateOne({ $push: { upVotes: username } });
      await post.updateOne({ $pull: { downVotes: username } });
      return res
        .status(200)
        .json({ message: "you added your upvote on this post." });
    } else {
      await post.updateOne({ $pull: { upVotes: username } });
      return res
        .status(200)
        .json({ message: "you removed your upvote on this post." });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* DownVote a Post
================== */
export const downVotePost = async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;

  try {
    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: "post not found" });

    if (!post.downVotes.includes(username)) {
      await post.updateOne({ $push: { downVotes: username } });
      await post.updateOne({ $pull: { upVotes: username } });
      return res
        .status(200)
        .json({ message: "you added your downvote on this post." });
    } else {
      await post.updateOne({ $pull: { downVotes: username } });
      return res
        .status(200)
        .json({ message: "you removed your downvote on this post." });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Add Comment to a Post
======================== */
export const addComment = async (req, res) => {
  const { username } = req.user;
  const { id } = req.params;

  const comment = req.body;

  /* 
    comment : {
        id: String,
        text: String,
        image: String
        
    }
  */

  try {
    const post = await PostModel.findById(id);
    await post.updateOne({ $push: { comments: comment } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Delete Comment
================= */
export const deleteComment = async (req, res) => {
  return res.json.params();
};
