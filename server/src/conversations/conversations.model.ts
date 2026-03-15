export * from "./conversations.model";
import { prisma, Conversation, ConversationWithParticipants, ConversationWithParticipantsIds } from "@/core/db";

export type { Conversation, ConversationWithParticipants, ConversationWithParticipantsIds };

export const getAllConversations = async (userId: number): Promise<ConversationWithParticipants[]> => {
  return prisma.conversation.findMany({
    orderBy: { id: "desc" },
    where: {
      participants: {
        some: { id: userId },
      },
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      participants: { select: { id: true, username: true } },
    },
  });
};

export const getConversationById = async (id: number): Promise<ConversationWithParticipants | null> => {
  return prisma.conversation.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      participants: { select: { id: true, username: true } },
      messages: { select: { id: true, text: true, authorId: true } },
    },
  });
};

export const createConversation = async (
  title: string,
  participantIds: number[] = []
): Promise<ConversationWithParticipantsIds> => {
  // Check if a conversation with the same participants exists
  const existing = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: { id: { in: participantIds } },
      },
      AND: [
        { participants: { every: { id: { in: participantIds } } } },
        { participants: { none: { id: { notIn: participantIds } } } },
      ],
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      participants: { select: { id: true } },
    },
  });
  if (existing) return existing;
  return prisma.conversation.create({
    data: {
      title,
      participants: participantIds.length
        ? { connect: participantIds.map(id => ({ id })) }
        : undefined,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      participants: { select: { id: true } },
    },
  });
};

export const updateConversation = async (
  id: number,
  title: string,
  participantIds?: number[]
): Promise<ConversationWithParticipantsIds | null> => {
  return prisma.conversation.update({
    where: { id },
    data: {
      title,
      ...(participantIds
        ? { participants: { set: participantIds.map(id => ({ id })) } }
        : {}),
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      participants: { select: { id: true } },
    },
  });
};

export const deleteConversationById = async (id: number): Promise<boolean> => {
  try {
    await prisma.conversation.delete({ where: { id } });
    return true;
  } catch (e) {
    return false;
  }
};
