
import { PrismaClient, type Message, type User, type Conversation, type Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

type ConversationWithParticipants = Prisma.ConversationGetPayload<{
  include: { participants: { select: { id: true, username: true } } };
}>;

type ConversationWithParticipantsIds = Prisma.ConversationGetPayload<{
  include: { participants: { select: { id: true } } };
}>;

export type { Message, User, Conversation, ConversationWithParticipants, ConversationWithParticipantsIds };  