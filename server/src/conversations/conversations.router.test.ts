import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";

vi.mock("../core/db", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express from "express";
import conversationRouter from "./conversations.router";
import { sign } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "../core/db"; 

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const JWT_SECRET = "dev_secret";
const TEST_USER = { id: 1, username: "testuser" };

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/conversations", conversationRouter);

describe("conversation.router (with auth)", () => {
  let token: string;
  beforeEach(() => {
    mockReset(prismaMock);
    token = sign(TEST_USER, JWT_SECRET);
  });


  it("GET /conversations should return 200 with auth", async () => {
    prismaMock.conversation.findMany.mockResolvedValue([
      {
        id: 1,
        title: "Test Conversation",
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: [{ id: 1, username: "testuser" }],
      } as any,
    ]);
    const res = await request(app)
      .get("/conversations")
      .set("Cookie", `token=${token}`);
    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe("Test Conversation");
  });


  it("POST /conversations should return 201 with auth", async () => {
    prismaMock.conversation.create.mockResolvedValue({
      id: 2,
      title: "Router New",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 1 }, { id: 2 }],
    } as any);
    const res = await request(app)
      .post("/conversations")
      .set("Cookie", `token=${token}`)
      .send({ title: "Router New", participants: [1, 2] });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Router New");
    expect(res.body.participants).toEqual([{ id: 1 }, { id: 2 }]);
  });


  it("PUT /conversations/:id should return 200 with auth", async () => {
    prismaMock.conversation.update.mockResolvedValue({
      id: 3,
      title: "Router Updated",
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [{ id: 2 }],
    } as any);
    const res = await request(app)
      .put("/conversations/1")
      .set("Cookie", `token=${token}`)
      .send({ title: "Router Updated", participants: [2] });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Router Updated");
    expect(res.body.participants).toEqual([{ id: 2 }]);
  });


  it("DELETE /conversations/:id should return 200 with auth", async () => {
    prismaMock.conversation.delete.mockResolvedValue({} as any);
    const res = await request(app)
      .delete("/conversations/1")
      .set("Cookie", `token=${token}`);
    expect(res.status).toBe(204);
  });

  it("GET /conversations should return 401 without auth", async () => {
    const res = await request(app).get("/conversations");
    expect(res.status).toBe(401);
  });

  it("POST /conversations should return 401 without auth", async () => {
    const res = await request(app)
      .post("/conversations")
      .send({ title: "Router New", participants: [1, 2] });
    expect(res.status).toBe(401);
  });

  it("PUT /conversations/:id should return 401 without auth", async () => {
    const res = await request(app)
      .put("/conversations/1")
      .send({ title: "Router Updated", participants: [2] });
    expect(res.status).toBe(401);
  });

  it("DELETE /conversations/:id should return 401 without auth", async () => {
    const res = await request(app).delete("/conversations/1");
    expect(res.status).toBe(401);
  });
});
