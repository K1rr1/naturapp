import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthenticatedRequest = Request & {
  user?: {
    sub: string;
    username: string;
    iat?: number;
    exp?: number;
  };
};

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Ingen token skickad." });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET saknas i backend." });
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthenticatedRequest["user"];

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Ogiltig token." });
  }
}