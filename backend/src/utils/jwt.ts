import * as jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as NonNullable<
  jwt.SignOptions["expiresIn"]
>;

if (!JWT_SECRET) {
  throw new Error("JWT_Secret not set in env");
}

export const generateToken = (userId: string, email: string): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not configured");
  }
  return jwt.sign(
    {
      userId,
      email,
    } as Record<string, unknown>,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  if (!JWT_SECRET) throw new Error("JWT secret not configured");
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const decodeToken = (token: string): JwtPayload | null => {
  return jwt.decode(token) as JwtPayload | null;
};
