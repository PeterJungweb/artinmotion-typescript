import { supabase } from "../utils/supabase.js";
import {
  hashPassword,
  comparePassword,
  validatePassword,
} from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import crypto from "crypto";
import type { Request, Response } from "express";
import type { UserRow, RegisterBody } from "../types/authTypes.js";
import type { SupabaseResponse } from "../types/supabaseResponseType.js";
import { execFile } from "child_process";

type ExtendedRequest = Request & { user?: UserRow };

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
): Promise<Response | void> => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: "Password does not meet requirements",
        details: passwordValidation.errors,
      });
    }

    // Check if user already exists
    const { data: existingUser } = (await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle()) as SupabaseResponse<UserRow>;

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const { data: newUser, error: insertErr } = (await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        phone: phone,
        email_verification_token: emailVerificationToken,
      })
      .select("id, email, full_name, email_verified")
      .single()) as SupabaseResponse<UserRow>;

    if (insertErr || !newUser) {
      console.error("Database error: ", insertErr);
      return res.status(500).json({ error: "Failed to create user" });
    }

    // Generate JWT token
    const token = generateToken(newUser.id, newUser.email);

    console.log(`✅ User registered: ${newUser.email}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        emailVerified: newUser.email_verified,
      },
      token,
    });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const login = async (
  req: Request<{}, {}, { email?: string; password?: string }>,
  res: Response,
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const { data: user, error } = (await supabase
      .from("users")
      .select("id, email, password_hash, full_name, email_verified")
      .eq("email", email.toLowerCase())
      .single()) as SupabaseResponse<UserRow>;

    if (error || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await comparePassword(
      password,
      user.password_hash ?? "",
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    console.log(`✅ User logged in: ${user.email}`);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        emailVerified: user.email_verified,
      },
      token,
    });
  } catch (error: unknown) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const logout = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  // With JWT, logout is handled client-side by removing the token
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getProfile = async (
  req: ExtendedRequest,
  res: Response,
): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not Authenticated" });
    }

    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error: unknown) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
