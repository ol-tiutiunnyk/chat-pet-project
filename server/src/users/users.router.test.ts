import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";

vi.mock("../core/db", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

import router from "./users.router";
import { it, describe, expect, vi, beforeEach } from "vitest";
import { PrismaClient } from "../../generated/prisma";
import { prisma } from "../core/db"; 

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("user.router", () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it("should have register, login, logout, and is-auth routes with correct methods", () => {
    const stack = (router as any).stack
      .filter((l: any) => l.route)
      .map((l: any) => ({
        path: l.route.path,
        methods: Object.keys(l.route.methods).filter((m) => l.route.methods[m]),
      }));

    expect(stack).toEqual(
      expect.arrayContaining([
        { path: "/register", methods: expect.arrayContaining(["post"]) },
        { path: "/login", methods: expect.arrayContaining(["post"]) },
        { path: "/is-auth", methods: expect.arrayContaining(["get"]) },
        { path: "/logout", methods: expect.arrayContaining(["post"]) },
        { path: "/", methods: expect.arrayContaining(["get"]) },
      ])
    );
  });
});
