import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";
  

vi.mock("./conversations.service", () => ({
  getAllConversations: vi.fn(),
  getConversationById: vi.fn(),
  createConversation: vi.fn(),
  updateConversation: vi.fn(),
  deleteConversationById: vi.fn(),
}));
import * as service from "./conversations.service";

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as conversationController from "./conversations.controller";
import * as conversationService from "./conversations.service";


describe("conversation.controller (mocked service)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get all conversations", async () => {
    const mockConversations = [
      {
        id: 1,
        title: "Controller Conversation",
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: [{ id: 1 }, { id: 2 }],
      },
    ];
    (service.getAllConversations as any).mockResolvedValueOnce(mockConversations);
    const req = { user: { id: 1 } } as any;
    const res = { json: vi.fn() } as any;
    const next = vi.fn();
    await conversationController.getConversationsController(req, res, next);
    expect(res.json).toHaveBeenCalledWith(mockConversations);
  });

  it("should get conversation by id", async () => {
    const mockConversation = {
      id: 2,
      title: "Controller FindMe",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 1 }],
    };
    (service.getConversationById as any).mockResolvedValueOnce(mockConversation);
    const req = { params: { id: 2 } } as any;
    const res = { json: vi.fn() } as any;
    const next = vi.fn();
    await conversationController.getConversationController(req, res, next);
    expect(res.json).toHaveBeenCalledWith(mockConversation);
  });

  it("should create conversation with participants", async () => {
    const mockConversation = {
      id: 3,
      title: "Controller New",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 1 }, { id: 2 }],
    };
    (service.createConversation as any).mockResolvedValueOnce(mockConversation);
    const req = { body: { title: "Controller New", participants: [1, 2] } } as any;
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis(), send: vi.fn() } as any;
    const next = vi.fn();
    await conversationController.createConversationController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockConversation);
  });

  it("should update conversation participants", async () => {
    const mockConversation = {
      id: 4,
      title: "Controller Updated",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 2 }],
    };
    (service.updateConversation as any).mockResolvedValueOnce(mockConversation);
    const req = { params: { id: 4 }, body: { title: "Controller Updated", participants: [2] } } as any;
    const res = { json: vi.fn() } as any;
    const next = vi.fn();
    await conversationController.updateConversationController(req, res, next);
    expect(res.json).toHaveBeenCalledWith(mockConversation);
  });

  it("should delete conversation by id", async () => {
    (service.deleteConversationById as any).mockResolvedValueOnce(true);
    const req = { params: { id: 5 } } as any;
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis(), send: vi.fn() } as any;
    const next = vi.fn();
    await conversationController.deleteConversationController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
