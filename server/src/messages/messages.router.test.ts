import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express from "express";
import messagesRouter from "./messages.router";

import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

vi.mock("./messages.controller", () => ({
  getMessagesController: vi.fn((req, res) => res.json([{ id: 1, text: "mocked" }])),
  getMessageController: vi.fn((req, res) => res.json({ id: 1, text: "mocked" })),
  createMessageController: vi.fn((req, res) => res.status(201).json({ id: 1, text: req.body.text })),
  updateMessageController: vi.fn((req, res) => res.json({ id: req.params.id, text: req.body.text })),
  deleteMessageController: vi.fn((req, res) => res.status(204).send()),
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/messages", messagesRouter);


describe("Messages API (mocked controller)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject unauthenticated create", async () => {
    const res = await request(app)
      .post("/api/messages")
      .send({ text: "Hello" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should create a message with valid token", async () => {
    const token = jwt.sign({ id: 42, username: "testuser" }, "dev_secret");
    const res = await request(app)
      .post("/api/messages")
      .set("Cookie", `token=${token}`)
      .send({ text: "Hello" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, text: "Hello" });
  });

  it("should reject unauthenticated get all", async () => {
    const res = await request(app).get("/api/messages");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should get all messages with valid token", async () => {
    const token = jwt.sign({ id: 1, username: "testuser" }, "dev_secret");
    const res = await request(app)
      .get("/api/messages")
      .set("Cookie", `token=${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, text: "mocked" }]);
  });

  it("should reject unauthenticated get by id", async () => {
    const res = await request(app).get(`/api/messages/3`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should get a message by id with valid token", async () => {
    const token = jwt.sign({ id: 1, username: "testuser" }, "dev_secret");
    const res = await request(app)
      .get(`/api/messages/3`)
      .set("Cookie", `token=${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, text: "mocked" });
  });

  it("should reject unauthenticated update", async () => {
    const res = await request(app).put(`/api/messages/4`).send({ text: "New" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should update a message with valid token", async () => {
    const token = jwt.sign({ id: 1, username: "testuser" }, "dev_secret");
    const res = await request(app)
      .put(`/api/messages/4`)
      .set("Cookie", `token=${token}`)
      .send({ text: "New" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "4", text: "New" });
  });

  it("should reject unauthenticated delete", async () => {
    const res = await request(app).delete(`/api/messages/5`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should delete a message with valid token", async () => {
    const token = jwt.sign({ id: 1, username: "testuser" }, "dev_secret");
    const res = await request(app)
      .delete(`/api/messages/5`)
      .set("Cookie", `token=${token}`);
    expect(res.status).toBe(204);
  });
});
