import UserModel from "../models/User.js";
import PostModel from "../models/Post.js";
import bcrypt from "bcrypt";

/* Get User Data
================ */
// @GET '/:username'
export const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const { password, ...otherData } = user._doc;

    /* 
    To detect if the logged user is one of these: 
      1.same target user            =>  state = -1
      2. following target user      =>  state = 1
      3. not following target user  =>  state = 0
    */
    let state;

    if (req.user.username === username) {
      state = -1;
    } else if (otherData.followers.includes(req.user.username)) {
      state = 1;
    } else {
      state = 0;
    }

    delete otherData.followers;
    delete otherData.following;
    delete otherData.createdAt;
    delete otherData.updatedAt;
    delete otherData.__v;

    const postsCount = await PostModel.countDocuments({
      username: user.username,
    });

    return res.status(200).json({
      ...otherData,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      postsCount: postsCount,
      state,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Update User Data
=================== */
// @PUT '/'
export const updateUserInfo = async (req, res) => {
  const { username } = req.user;

  delete req.body.username;
  delete req.body.password;

  try {
    const user = await UserModel.findOneAndUpdate({ username }, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "user does not exist." });
    }

    return res.status(200).json({ message: "user data updated successfully." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Delete User
============== */
// @DELETE '/'
export const deleteUser = async (req, res) => {
  const { username } = req.user;

  try {
    const user = await UserModel.findOneAndDelete({
      username: req.user.username,
    });
    if (!user)
      return res.status(500).json({ message: "internal server error." });

    return res.status(200).json({ message: "user deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Upload Profile Picture
========================= */
// @PUT '/profile'
export const uploadProfilePicture = async (req, res) => {
  const { username } = req.user;

  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { profilePicture: req.file.path }
    );

    if (!user) return res.status(500).json({ message: "server error" });

    return res
      .status(200)
      .json({ message: "profile picture updated successfully." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Upload Cover Picture
======================= */
// @PUT '/cover'
export const uploadCoverPicture = async (req, res) => {
  const { username } = req.user;

  try {
    const user = await UserModel.findOneAndUpdate(
      { username },
      { coverPicture: req.file.path }
    );

    if (!user) return res.status(500).json({ message: "server error" });

    return res
      .status(200)
      .json({ message: "cover picture updated successfully." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Update User Password
======================= */
// @PUT '/password'
export const updatePassword = async (req, res) => {
  const { username } = req.user;

  const { newPassword, oldPassword } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (newPassword && oldPassword) {
      const match = bcrypt.compare(oldPassword, user.password);

      if (match) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedUser = await UserModel.findOneAndUpdate(
          { username },
          { password: hashedPassword }
        );

        if (!updatedUser)
          return res.status(500).json({ message: "server error" });

        return res.status(200).json({ message: "password updated" });
      } else {
        return res.json(400).json({ message: "old password does not match" });
      }
    } else {
      return res
        .json(400)
        .json({ message: "old password and new password are required" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Get Images
============= */
// @GET '/downloads/:path'
export const getFile = (req, res) => {
  res.download("./uploads/" + req.params.path);
};

/* Follow User
============== */
// @PUT '/follow/:username'
export const followUser = async (req, res) => {
  const { username } = req.user;
  const targetUsername = req.params.username;

  if (username === targetUsername)
    return res.status(403).json({ message: "you can't follow yourself" });

  try {
    const currentUser = await UserModel.findOne({ username });
    const targetUser = await UserModel.findOne({ username: targetUsername });

    if (!targetUser)
      return res.status(404).json({
        message: "you are trying to follow a user that does not exist",
      });

    if (targetUser.followers.includes(username))
      return res.status(403).json({ message: "you already follow this user" });

    await targetUser.updateOne({ $push: { followers: username } });
    await currentUser.updateOne({ $push: { following: targetUsername } });

    return res.status(200).json({ message: `you followed ${targetUsername}` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Unfollow User
================ */
// @PUT '/unfollow/:username'
export const unfollowUser = async (req, res) => {
  const { username } = req.user;
  const targetUsername = req.params.username;

  if (username === targetUsername)
    return res.status(403).json({ message: "you can't unfollow yourself" });

  try {
    const currentUser = await UserModel.findOne({ username });
    const targetUser = await UserModel.findOne({ username: targetUsername });

    if (!targetUser)
      return res.status(404).json({
        message: "you are trying to follow a user that does not exist",
      });

    if (!targetUser.followers.includes(username))
      return res
        .status(403)
        .json({ message: "you already not following this user" });

    await targetUser.updateOne({ $pull: { followers: username } });
    await currentUser.updateOne({ $pull: { following: targetUsername } });

    return res
      .status(200)
      .json({ message: `you unfollowed ${targetUsername}` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
