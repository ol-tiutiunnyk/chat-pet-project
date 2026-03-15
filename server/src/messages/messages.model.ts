import { prisma, Message } from "../core/db";

export type { Message };

export const getAllMessages = async (): Promise<Message[]> => {
  return prisma.message.findMany({
    orderBy: { id: "desc" },
    select: { id: true, text: true, authorId: true, conversationId: true },
  });
};

export const getMessageById = async (id: number): Promise<Message | null> => {
  return prisma.message.findUnique({
    where: { id },
    select: { id: true, text: true, authorId: true, conversationId: true },
  });
};

export const createMessage = async (text: string, authorId: number, conversationId: number): Promise<Message> => {
  return prisma.message.create({
    data: { text, authorId, conversationId },
    select: { id: true, text: true, authorId: true, conversationId: true },
  });
};

export const updateMessage = async (id: number, text: string): Promise<Message | null> => {
  return prisma.message.update({
    where: { id },
    data: { text },
    select: { id: true, text: true, authorId: true, conversationId: true },
  });
};

export const deleteMessageById = async (id: number): Promise<boolean> => {
  try {
    await prisma.message.delete({ where: { id } });
    return true;
  } catch (e) {
    return false;
  }
};
