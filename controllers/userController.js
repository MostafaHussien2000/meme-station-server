import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

/* Get User Data
================ */
// @GET '/:username'
export const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "user does not exist" });
    }

    const { password, ...otherData } = user._doc;

    return res.status(200).json(otherData);
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
