import { Request, Response, NextFunction } from "express";

import * as authService from "./auth.service";

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password, res);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getUserController = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    const user = authService.getUserFromToken(token);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const logoutController = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = authService.logout(res);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};