import { describe, it, beforeEach, expect, vi } from "vitest";
import * as controller from "./messages.controller";

// Mock the service layer
vi.mock("./messages.service", () => ({
  getAllMessages: vi.fn(),
  getMessageById: vi.fn(),
  createMessage: vi.fn(),
  updateMessage: vi.fn(),
  deleteMessageById: vi.fn(),
}));
import * as service from "./messages.service";

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

describe("messages.controller (mocked service)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("getMessagesController returns all messages", async () => {
    const mockMessages = [
      { id: 1, text: "A", authorId: 1, conversationId: 1 },
      { id: 2, text: "B", authorId: 1, conversationId: 1 },
    ];
    (service.getAllMessages as any).mockResolvedValueOnce(mockMessages);
    const res = mockRes();
    await controller.getMessagesController({} as any, res, vi.fn());
    expect(res.json).toHaveBeenCalledWith(mockMessages);
  });


  it("getMessageController returns 404 for missing", async () => {
    (service.getMessageById as any).mockImplementationOnce(() => { throw { status: 404, message: "Not found" }; });
    const res = mockRes();
    const req = { params: { id: "123" } } as any;
    const next = vi.fn();
    await controller.getMessageController(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
  });


  it("createMessageController validates input", async () => {
    (service.createMessage as any).mockImplementationOnce(() => { throw { status: 400, message: "Text is required" }; });
    const res = mockRes();
    const req = { body: { }, user: { id: 1 } } as any;
    const next = vi.fn();
    await controller.createMessageController(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }));
  });


  it("createMessageController creates a message", async () => {
    const mockMessage = { id: 1, text: "Hello", authorId: 1, conversationId: 1 };
    (service.createMessage as any).mockResolvedValueOnce(mockMessage);
    const res = mockRes();
    const req = { body: { text: "Hello", conversationId: 1 }, user: { id: 1 } } as any;
    const next = vi.fn();

    await controller.createMessageController(req, res, next);
  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ text: "Hello" })
    );
  });


  it("updateMessageController validates input and not found", async () => {
    (service.updateMessage as any).mockImplementationOnce(() => { throw { status: 400, message: "Text is required" }; });
    const res = mockRes();
    const req = { params: { id: "1" }, body: {} } as any;
    const next = vi.fn();
    await controller.updateMessageController(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }));
    (service.updateMessage as any).mockImplementationOnce(() => { throw { status: 404, message: "Not found" }; });
    req.body = { text: "X" };
    await controller.updateMessageController(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
  });


  it("updateMessageController updates a message", async () => {
    const updatedMessage = { id: 2, text: "New", authorId: 1, conversationId: 1 };
    (service.updateMessage as any).mockResolvedValueOnce(updatedMessage);
    const res = mockRes();
    const req = { params: { id: String(updatedMessage.id) }, body: { text: "New" } } as any;
    const next = vi.fn();
    await controller.updateMessageController(req, res, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: updatedMessage.id, text: "New" })
    );
  });


  it("deleteMessageController returns 404 for missing", async () => {
    (service.deleteMessageById as any).mockImplementationOnce(() => { throw { status: 404, message: "Not found" }; });
    const res = mockRes();
    const req = { params: { id: "1" } } as any;
    const next = vi.fn();
    await controller.deleteMessageController(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
  });


  it("deleteMessageController deletes a message", async () => {
    (service.deleteMessageById as any).mockResolvedValueOnce({});
    const res = mockRes();
    const req = { params: { id: "3" } } as any;
    const next = vi.fn();
    await controller.deleteMessageController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
