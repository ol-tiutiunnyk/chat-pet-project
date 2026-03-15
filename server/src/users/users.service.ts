import { isNil } from "@/core/types/typecheck";
import { getAllUsers, createUser as modelCreateUser, getUserByUsername as modelGetUserByUsername } from "./users.model";
import ResponseError from "@/core/errors/response-error";
import bcrypt from "bcryptjs";

function assertRegisterInput (username: unknown, password: unknown): asserts username is string & NonNullable<typeof username> & string & NonNullable<typeof password> {
  if (isNil(username) || isNil(password)) {
    throw new ResponseError("Username and password required", 400);
  }
};

function assertUsernameAvailable (existing: unknown): asserts existing is null {
  if (!isNil(existing)) {
    throw new ResponseError("Username already taken", 409);
  }
};

export const listUsers = async (search?: string) => {
  return getAllUsers(search);
};

export const registerUser = async (username: string, password: string) => {
  assertRegisterInput(username, password);
  const existing = await modelGetUserByUsername(username);

  assertUsernameAvailable(existing);
  const hashed = await bcrypt.hash(password, 10);

  const user = await modelCreateUser(username, hashed);
  return { id: user.id, username: user.username };
};

export const getUserByUsername = async (username: string) => {
  return modelGetUserByUsername(username);
};
