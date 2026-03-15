import { isNil, isNumber, isString } from "@/core/types/typecheck";
 import {
 getAllConversations as dbGetAllConversations,
  getConversationById as dbGetConversationById,
  createConversation as dbCreateConversation,
  updateConversation as dbUpdateConversation,
  deleteConversationById as dbDeleteConversationById,
} from "./conversations.model";
import ResponseError from "@/core/errors/response-error";
import { assertFound } from "@/core/validators";

function assertUserId(userId: unknown): asserts userId is number {
  if (isNil(userId) || typeof userId !== "number") {
    throw new ResponseError("Unauthorized", 401);
  }
}

function assertParticipants(participants: unknown): asserts participants is number[] {
  if (
    !Array.isArray(participants) ||
    participants.some((id) => !isNumber(id))
  ) {
    throw new ResponseError("Participants must be an array of numbers", 400);
  }
}

function assertTitle(title: unknown): asserts title is string {
  if (!isString(title)) {
    throw new ResponseError("Title is required", 400);
  }
}

export const getAllConversations = async (userId: number) => {
  assertUserId(userId);
  return dbGetAllConversations(userId);
};

export const getConversationById = async (id: number) => {
  const conversation = await dbGetConversationById(id);

  assertFound(conversation);
  return conversation;
};

export const createConversation = async (title: string, participants: number[]) => {
  assertParticipants(participants);
  assertTitle(title);

  return dbCreateConversation(title, participants);
};

export const updateConversation = async (id: number, title: string, participants: number[]) => {
  assertParticipants(participants);
  assertTitle(title);

  const conversation = await dbUpdateConversation(id, title, participants);

  assertFound(conversation);
  return conversation;
};

export const deleteConversationById = async (id: number) => {
  const ok = await dbDeleteConversationById(id);

  assertFound(ok);
  return ok;
};
