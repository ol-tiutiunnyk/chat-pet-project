vi.mock("./messages.model", () => ({
  getAllMessages: vi.fn(),
  getMessageById: vi.fn(),
  createMessage: vi.fn(),
  updateMessage: vi.fn(),
  deleteMessageById: vi.fn(),
}));
import * as model from "./messages.model";

import { beforeEach, describe, it, expect, vi } from "vitest";
import * as service from "./messages.service";


describe("messages.service (mocked model)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a message", async () => {
    const mockMessage = { id: 1, text: "A", authorId: 1, conversationId: 1 };
    (model.createMessage as any).mockResolvedValueOnce(mockMessage);
    const result = await service.createMessage("A", 1, 1);
    expect(result).toEqual(mockMessage);
    expect(model.createMessage).toHaveBeenCalledWith("A", 1, 1);
  });

  it("gets a message by id", async () => {
    const mockMessage = { id: 2, text: "FindMe", authorId: 1, conversationId: 1 };
    (model.getMessageById as any).mockResolvedValueOnce(mockMessage);
    const found = await service.getMessageById(2);
    expect(found).toEqual(mockMessage);
    (model.getMessageById as any).mockResolvedValueOnce(null);
    await expect(() => service.getMessageById(999999)).rejects.toThrow();
  });

  it("updates a message", async () => {
    const updatedMessage = { id: 3, text: "New", authorId: 1, conversationId: 1 };
    (model.getMessageById as any).mockResolvedValueOnce(updatedMessage);
    (model.updateMessage as any).mockResolvedValueOnce(updatedMessage);
    const result = await service.updateMessage(3, "New", 1);
    expect(result).toEqual(updatedMessage);
    expect(model.updateMessage).toHaveBeenCalledWith(3, "New");
  });

  it("deletes a message by id", async () => {
    const mockMessage = { id: 4, text: "A", authorId: 1, conversationId: 1 };
    (model.getMessageById as any).mockResolvedValueOnce(mockMessage);
    (model.deleteMessageById as any).mockResolvedValueOnce(true);
    expect(await service.deleteMessageById(4, 1)).toBe(true);
    (model.getMessageById as any).mockResolvedValueOnce(null);
    await expect(() => service.deleteMessageById(999999, 1)).rejects.toThrow();
  });

  it("returns all messages in correct order", async () => {
    const mockMessages = [
      { id: 2, text: "Second", authorId: 1, conversationId: 1 },
      { id: 1, text: "First", authorId: 1, conversationId: 1 },
    ];
    (model.getAllMessages as any).mockResolvedValueOnce(mockMessages);
    const all = await service.getAllMessages();
    expect(all).toEqual(mockMessages);
    expect(model.getAllMessages).toHaveBeenCalled();
  });
});
