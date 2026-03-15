import { isNil } from "@/core/types/typecheck";
import { getUserByUsername as modelGetUserByUsername } from "./users.model";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "@/core/auth/token";
import ResponseError from "@/core/errors/response-error";
import { Response } from "express";

function assertLoginInput(
  data: { username: unknown; password: unknown }
): asserts data is { username: string; password: string } {
  const { username, password } = data;
  if (isNil(username) || isNil(password)) {
    throw new ResponseError("Username and password required", 400);
  }
}

function assertUserFound(user: unknown): asserts user is { id: number; username: string; password: string } {
  if (isNil(user)) {
    throw new ResponseError("Invalid credentials", 401);
  }
}

async function assertPasswordValid(password: string, user: { password: string }): Promise<void> {
  const valid = await bcrypt.compare(password, user.password);

  if (isNil(valid) || valid !== true) {
    throw new ResponseError("Invalid credentials", 401);
  }
}

function assertToken(token: unknown): asserts token is string {
  if (isNil(token)) {
    throw new ResponseError("Not authenticated", 401);
  }
}

function assertPayloadValid(payload: unknown): asserts payload is { id: number; username: string } {
  if (isNil(payload)) {
    throw new ResponseError("Invalid token payload", 401);
  }
}

export const login = async (username: string, password: string, res: Response) => {
  assertLoginInput({ username, password });
  const user = await modelGetUserByUsername(username);

  assertUserFound(user);
  await assertPasswordValid(password, user);

  const token = generateToken({ id: user.id, username: user.username });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { message: "Logged in" };
};

export const getUserFromToken = (token: string | undefined) => {
  assertToken(token);
  const payload = verifyToken(token);
  assertPayloadValid(payload);
  return { id: payload.id, username: payload.username };
};

export const logout = (res: Response) => {
  res.clearCookie("token");
  return { message: "Logged out" };
};
