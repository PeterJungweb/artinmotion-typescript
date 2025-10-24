import { supabase } from "../utils/supabase.js";
import { verifyToken } from "../utils/jwt.js";

import type { Response, Request, NextFunction } from "express";
import type { SupabaseResponse } from "../types/supabaseResponseType.js";
import type { UserRow } from "../types/authTypes.js";


type ExtendedRequest = Request & { user?: UserRow };

export const authenticateToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = String(req.headers.authorization ?? "");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Auth-Header" });
    }

    const token = authHeader.split("")[1]; // Bearer TOKEN
    const payload = verifyToken(token);

    const userId = (payload &&
      (payload.sub ?? payload.userId ?? payload.id)) as string | undefined;

    if (!userId) {
      return res.status(401).json({ error: "Invalid Token payload" });
    }

    // Verify user
    const { data: user, error } = (await supabase
      .from("users")
      .select("id, email, full_name, email_verified")
      .eq("id", userId)
      .single()) as SupabaseResponse<UserRow>;

    if (error || !user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error: unknown) {
    console.error("Auth middleware error: ", error);
    return res.status(403).json({
      error: "Invalid or expired",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const optionalAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = String(req.headers.authorization ?? "");
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return next();
    }


    const token = authHeader.split(" ")[1];

    try{
      const payload = verifyToken(token);
      const userId = (payload && (
        payload.sub ?? payload.userId ?? payload.id)) as string | undefined;
      
      if(!userId)return next();

      const {data: user, error} = (await supabase
        .from("users")
        .select("id, email, full_name,email_verified")
        .eq("id", userId)
        .single()) as SupabaseResponse<UserRow>
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the JWT token with Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Add user to request object
    req.user = data.user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
