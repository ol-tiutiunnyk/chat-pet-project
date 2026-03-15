import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";

vi.mock("../core/db", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "../core/db";
import * as conversationModel from "./conversations.model";
import { PrismaClient } from "../../generated/prisma";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("conversation.model", () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it("gets all conversations", async () => {
    prismaMock.conversation.findMany.mockResolvedValue([
      {
        id: 1,
        title: "Test Conversation",
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: [{ id: 1, username: "user1" }, { id: 2, username: "user2" }],
      } as any,
    ]);
    const result = await conversationModel.getAllConversations(1);
    expect(result[0].title).toBe("Test Conversation");
    expect(result[0].participants).toEqual([{ id: 1, username: "user1" }, { id: 2, username: "user2" }]);
  });

  it("gets conversation by id", async () => {
    prismaMock.conversation.findUnique.mockResolvedValue({
      id: 2,
      title: "FindMe",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 1, username: "user1" }],
      messages: [],
    } as any);
    const result = await conversationModel.getConversationById(2);
    expect(result?.title).toBe("FindMe");
    expect(result?.participants).toEqual([{ id: 1, username: "user1" }]);
  });

  it("creates conversation with participants", async () => {
    prismaMock.conversation.create.mockResolvedValue({
      id: 3,
      title: "New",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 1 }, { id: 2 }],
    } as any);
    // The model may check for existing conversation first, so mock that as well
    prismaMock.conversation.findFirst.mockResolvedValue(null);
    const result = await conversationModel.createConversation("New", [1, 2]);
    expect(result.title).toBe("New");
    expect(result.participants).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("updates conversation participants", async () => {
    prismaMock.conversation.update.mockResolvedValue({
      id: 4,
      title: "Updated",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 2 }],
    } as any);
    // The model may check for existing conversation first, so mock that as well
    prismaMock.conversation.findUnique.mockResolvedValue({
      id: 4,
      title: "Old",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 2 }],
    } as any);
    const result = await conversationModel.updateConversation(4, "Updated", [2]);
    expect(result?.title).toBe("Updated");
    expect(result?.participants).toEqual([{ id: 2 }]);
  });

  it("deletes conversation by id", async () => {
    prismaMock.conversation.delete.mockResolvedValue({} as any);
    // The model may check for existing conversation first, so mock that as well
    prismaMock.conversation.findUnique.mockResolvedValue({
      id: 5,
      title: "ToDelete",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [],
    } as any);
    const result = await conversationModel.deleteConversationById(5);
    expect(result).toBe(true);
  });
});
