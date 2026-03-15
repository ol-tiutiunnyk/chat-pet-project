
import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";

vi.mock("../core/db", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "../core/db";
import * as conversationService from "./conversations.service";
import { PrismaClient } from "../../generated/prisma";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("conversation.service", () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it("should return all conversations", async () => {
    prismaMock.conversation.findMany.mockResolvedValue([
      {
        id: 1,
        title: "Service Conversation",
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: [{ id: 1, username: "user1" }, { id: 2, username: "user2" }],
      } as any,
    ]);
    const result = await conversationService.getAllConversations(1);
    expect(result[0].title).toBe("Service Conversation");
    expect(result[0].participants).toEqual([{ id: 1, username: "user1" }, { id: 2, username: "user2" }]);
  });

  it("should return conversation by id", async () => {
    prismaMock.conversation.findUnique.mockResolvedValue({
      id: 2,
      title: "Service FindMe",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 1, username: "user1" }],
      messages: [],
    } as any);
    const result = await conversationService.getConversationById(2);
    expect(result?.title).toBe("Service FindMe");
    expect(result?.participants).toEqual([{ id: 1, username: "user1" }]);
  });

  it("should create conversation with participants", async () => {
    prismaMock.conversation.create.mockResolvedValue({
      id: 3,
      title: "Service New",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 1 }, { id: 2 }],
    } as any);
    prismaMock.conversation.findFirst.mockResolvedValue(null);
    const result = await conversationService.createConversation("Service New", [1, 2]);
    expect(result.title).toBe("Service New");
    expect(result.participants).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("should update conversation participants", async () => {
    prismaMock.conversation.update.mockResolvedValue({
      id: 4,
      title: "Service Updated",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 2 }],
    } as any);
    const result = await conversationService.updateConversation(4, "Service Updated", [2]);
    expect(result?.title).toBe("Service Updated");
    expect(result?.participants).toEqual([{ id: 2 }]);
  });

  it("should delete conversation by id", async () => {
    prismaMock.conversation.delete.mockResolvedValue({} as any);
    const result = await conversationService.deleteConversationById(5);
    expect(result).toBe(true);
  });
});
