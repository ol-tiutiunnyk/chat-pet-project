
import { prisma, User } from "@/core";

export const getAllUsers = async (search?: string): Promise<Pick<User, "id" | "username">[]> => {
  return prisma.user.findMany({
    where: search ? { username: { contains: search, mode: "insensitive" } } : undefined,
    select: { id: true, username: true },
    orderBy: { username: "asc" },
  });
};

export const isUser = (obj: unknown): obj is User => {
  return typeof obj === "object" && obj !== null && "id" in obj && "username" in obj && "password" in obj;
};

export const createUser = (username: string, password: string): Promise<User> => {
  return prisma.user.create({
    data: { username, password },
    select: { id: true, username: true, password: true },
  });
}

export const getUserByUsername = (username: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, password: true },
  });
}
