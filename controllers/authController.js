import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";

/* Registering New User
======================= */
// @POST '/register'
export const registerUser = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    username,
    password: hashedPassword,
    firstName,
    lastName,
    profilePicture: "uploads\\blank.png",
    coverPicture: "",
  });

  try {
    const user = await UserModel.findOne({ username });

    if (user)
      return res.json({
        message: "this username is already in use. pick another one.",
      });

    await newUser.save();

    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Login
======== */
// @POST '/login'
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(200)
      .json({ message: "please enter username and password to login" });
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const validity = await bcrypt.compare(password, user.password);

    if (!validity) {
      res.status(400).json({ message: "invalid password" });
    }

    const userPayload = {
      username: user.username,
      user_role: user.user_role,
    };

    const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET);

    const data = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
    };

    return res.status(200).json({ message: "logged in", data, accessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
