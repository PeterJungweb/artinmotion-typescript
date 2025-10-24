import express from "express";
import { AuthInvalidCredentialsError } from "@supabase/supabase-js";
import { register, login, logout, getProfile } from "../controllers/auth.js";
import { authenticateToken } from "../middlewares/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Min
  max: 5,
  message: { error: "???" }, // De und En
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);

//Protected routes
router.get("/profile", authenticateToken, getProfile);

export default router;
