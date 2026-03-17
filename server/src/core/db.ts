
import { PrismaClient, type Message, type User, type Conversation, type Prisma } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new pg.Pool({
  connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

type ConversationWithParticipants = Prisma.ConversationGetPayload<{
  include: { participants: { select: { id: true, username: true } } };
}>;

type ConversationWithParticipantsIds = Prisma.ConversationGetPayload<{
  include: { participants: { select: { id: true } } };
}>;

export type { Message, User, Conversation, ConversationWithParticipants, ConversationWithParticipantsIds };  