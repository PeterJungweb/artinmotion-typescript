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

    const token = authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

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
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) return next();

    try {
      const payload = verifyToken(token);
      const userId = (payload &&
        (payload.sub ?? payload.userId ?? payload.id)) as string | undefined;

      if (!userId) return next();

      const { data: user, error } = (await supabase
        .from("users")
        .select("id, email, full_name,email_verified")
        .eq("id", userId)
        .single()) as SupabaseResponse<UserRow>;

      if (!error && user) req.user = user;
    } catch {
      // invalid token -ignore and continue as unauthenticated!
    }

    return next();
  } catch (error: unknown) {
    console.error("Optional auth middleware error: ", error);
    return next();
  }
};

export const authMiddleware = authenticateToken;
