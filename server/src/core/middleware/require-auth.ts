import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isAuthToken, AuthToken } from "@/users/auth-token.model";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export type AuthorizedRequest = Request & {
  user?: AuthToken;
};

const requireAuth = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (!isAuthToken(payload)) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default requireAuth;
