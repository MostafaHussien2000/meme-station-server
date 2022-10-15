import express from "express";

import {
  deleteUser,
  getUser,
  updateUserInfo,
  uploadProfilePicture,
  uploadCoverPicture,
  updatePassword,
  getFile,
} from "../controllers/userController.js";

import validateToken from "../middlewares/authMiddleware.js";
import upload from "../middlewares/imageUploaderMiddleware.js";

const router = express.Router();

// Get User Data
router.get("/:username", getUser);

// Update User Data
router.put("/", validateToken, updateUserInfo);

// Delete User
router.delete("/", validateToken, deleteUser);

// Upload Profile Picture
router.put(
  "/profile/",
  validateToken,
  upload.single("profilePicture"),
  uploadProfilePicture
);

// Upload Cover Picture
router.put(
  "/cover/",
  validateToken,
  upload.single("coverPicture"),
  uploadCoverPicture
);

// Update Password
router.put("/password", validateToken, updatePassword);

// Get User Picture.
router.get("/uploads/:path", getFile);

export default router;
