import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";

vi.mock("../core/db", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

import * as userModel from "./users.model";
import { vi, it, describe, expect, beforeEach } from "vitest";
import { PrismaClient } from "../../generated/prisma";
import { prisma } from "../core/db";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("user.model", () => {

  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe("isUser", () => {
    it("returns true for valid User object", () => {
      const user = { id: 1, username: "test", password: "hash" };
      expect(userModel.isUser(user)).toBe(true);
    });
    it("returns false for invalid object", () => {
      expect(userModel.isUser({})).toBe(false);
      expect(userModel.isUser({ id: 1, username: "test" })).toBe(false);
      expect(userModel.isUser(null)).toBe(false);
      expect(userModel.isUser(undefined)).toBe(false);
      expect(userModel.isUser(123)).toBe(false);
      expect(userModel.isUser({ id: 1, password: "hash" })).toBe(false);
    });
  });

  describe("createUser", () => {
    it("calls prisma.user.create with correct args", async () => {
      prismaMock.user.create.mockResolvedValue({
        id: 1,
        username: "mockedUser",
        password: "mockedHashedPassword",
      });

      const result = await userModel.createUser(
        "mockedUser",
        "mockedHashedPassword"
      );

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          username: "mockedUser",
          password: "mockedHashedPassword",
        },
        select: {
          id: true,
          username: true,
          password: true,
        },
      });
      expect(result).toEqual({
        id: 1,
        username: "mockedUser",
        password: "mockedHashedPassword",
      });
    });
  });

  describe("getUserByUsername", () => {
    it("calls prisma.user.findUnique with correct args", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 2,
        username: "anotherUser",
        password: "anotherHashedPassword",
      });

      const result = await userModel.getUserByUsername(
        "anotherUser"
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          username: "anotherUser",
        },
        select: {
          id: true,
          username: true,
          password: true,
        },
      });
      expect(result).toEqual({
        id: 2,
        username: "anotherUser",
        password: "anotherHashedPassword",
      });
    });
  });
});
