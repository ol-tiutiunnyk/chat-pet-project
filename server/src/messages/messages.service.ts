import {
  getAllMessages as dbGetAllMessages,
  getMessageById as dbGetMessageById,
  createMessage as dbCreateMessage,
  updateMessage as dbUpdateMessage,
  deleteMessageById as dbDeleteMessageById,
} from "./messages.model";
import ResponseError from "@/core/errors/response-error";
import { isNumber, isString } from "@/core/types";
import { assertFound, assertIsAuthor } from "@/core/validators";

const validateId = (id: unknown) => {
  if (!isNumber(id)) {
    throw new ResponseError("Message ID is required", 400);
  }
};

export const getAllMessages = async () => dbGetAllMessages();

export const getMessageById = async (id: number) => {
  const message = await dbGetMessageById(id);
  assertFound(message);
  return message;
};

const validateCreateMessage = (data: { text: string; authorId: number; conversationId: number }) => {
  if (!isString(data.text) || !isNumber(data.authorId) || !isNumber(data.conversationId)) {
    throw new ResponseError("Invalid message data", 400);
  }
};

export const createMessage = async (text: string, authorId: number, conversationId: number) => {
  validateCreateMessage({ text, authorId, conversationId });
  return dbCreateMessage(text, authorId, conversationId);
};

const validateUpdateMessage = (data: { id: number; text: string; authorId?: number }) => {
  if (!isString(data.text) || !isNumber(data.id) || !isNumber(data.authorId)) {
    throw new ResponseError("Invalid message update data", 400);
  }
};

export const updateMessage = async (id: number, text: string, authorId?: number) => {
  validateUpdateMessage({ id, text, authorId });

  const existing = await dbGetMessageById(id);

  assertFound(existing);
  assertIsAuthor(existing.authorId, authorId);

  return await dbUpdateMessage(id, text);
};

export const deleteMessageById = async (id: number, authorId?: number) => {
  validateId(id);

  const existing = await dbGetMessageById(id);

  assertFound(existing);
  assertIsAuthor(existing.authorId, authorId);

  return await dbDeleteMessageById(id);
};
