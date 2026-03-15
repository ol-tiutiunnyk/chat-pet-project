
import { Request, Response, NextFunction } from "express";
import { AuthorizedRequest } from "../core/middleware/require-auth";
import {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessageById,
} from "./messages.service";

export const getMessagesController = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const getMessageController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const message = await getMessageById(id);
    res.json(message);
  } catch (err) {
    next(err);
  }
};

export const createMessageController = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {
    const { text, conversationId } = req.body;
    const { user } = req;
    console.log("BODY", req.body);
    console.log("USER", user);
    const message = await createMessage(text, user!.id, conversationId);
    res.status(201).json(message);
  } catch (err) {
    console.log("Error", err);
    next(err);
  }
};

export const updateMessageController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { text } = req.body;
    const message = await updateMessage(id, text);
    res.json(message);
  } catch (err) {
    next(err);
  }
};

export const deleteMessageController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await deleteMessageById(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const createMessageSocket = async (data: { text: string; conversationId: number; userId: number }) => {
  const { text, conversationId, userId } = data;
  const message = await createMessage(text, userId, conversationId);
  return message;
};

export const deleteMessageSocket = async (data: { id: number }) => {
  await deleteMessageById(data.id);
  return { id: data.id };
};
