import express from "express";

import { login, registerUser } from "../controllers/authController.js";

const router = express.Router();

// Register New User
router.post("/register", registerUser);

// Login
router.post("/login", login);

export default router;
