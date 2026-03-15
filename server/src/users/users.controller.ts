import { listUsers, registerUser } from "./users.service";
import { Request, Response, NextFunction } from "express";

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const users = await listUsers(search);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await registerUser(username, password);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};