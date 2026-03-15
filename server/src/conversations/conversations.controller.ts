import { Request, Response, NextFunction } from "express";
import { AuthorizedRequest } from "@/core/middleware";
import {
  getAllConversations,
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversationById,
} from "./conversations.service";

export const getConversationsController = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user && typeof req.user.id === 'number' ? req.user.id : undefined;
    const conversations = await getAllConversations(userId as number);
    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

export const getConversationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const conversation = await getConversationById(id);
    res.json(conversation);
  } catch (err) {
    next(err);
  }
};

export const createConversationController = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, participants } = req.body;
    const conversation = await createConversation(title, participants);
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
};

export const updateConversationController = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { title, participants } = req.body;
    const conversation = await updateConversation(id, title, participants);
    res.json(conversation);
  } catch (err) {
    next(err);
  }
};

export const deleteConversationController = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await deleteConversationById(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
