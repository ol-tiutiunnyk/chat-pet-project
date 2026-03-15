import { isAuthToken } from "@/users/auth-token.model";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = "7d";

type JWTPayloadShape = string | Record<string, unknown> | Buffer | ArrayBufferLike;
type ExpiresIn = StringValue | number;

export const generateToken = <T extends JWTPayloadShape>(payload: T, expiresIn: ExpiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (isAuthToken(payload)) {
      return payload;
    }
    return null;
  } catch (error) {
    return null;
  }
};