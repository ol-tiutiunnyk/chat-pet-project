
import { vi, afterEach, it, describe, expect } from "vitest";
import * as userController from "./users.controller";

vi.mock("./users.service", () => ({
  listUsers: vi.fn(),
  registerUser: vi.fn(),
}));
import * as service from "./users.service";


describe("users.controller (mocked service)", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if username or password missing", async () => {
    (service.registerUser as any).mockImplementationOnce(() => { throw { status: 400, message: "Username and password required" }; });
    const req = { body: { username: "", password: "" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();
    await userController.registerController(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }));
  });

  it("returns 409 if username taken", async () => {
    (service.registerUser as any).mockImplementationOnce(() => { throw { status: 409, message: "Username already taken" }; });
    const req = { body: { username: "existingUser", password: "existingHashedPassword" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();
    await userController.registerController(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 409 }));
  });

  it("creates user and returns 201", async () => {
    (service.registerUser as any).mockResolvedValueOnce({ id: 2, username: "newUser" });
    const req = { body: { username: "newUser", password: "newPassword" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();
    await userController.registerController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 2, username: "newUser" });
  });
});
