
import * as authController from "./auth.controller";
import { vi, afterEach, it, describe, expect, Mock } from "vitest";

vi.mock("./auth.service", () => ({
  login: vi.fn(),
  getUserFromToken: vi.fn(),
  logout: vi.fn(),
}));
import * as authService from "./auth.service";

describe("auth.controller (mocked service)", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("loginController", () => {
    it("returns 400 if username or password missing", async () => {
      (authService.login as any).mockImplementationOnce(() => { throw { status: 400, message: "Username and password required" }; });
      const req = { body: { username: "", password: "" } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await authController.loginController(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }));
    });

    it("returns 401 if user not found", async () => {
      (authService.login as any).mockImplementationOnce(() => { throw { status: 401, message: "Invalid credentials" }; });
      const req = { body: { username: "u", password: "p" } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await authController.loginController(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
    });

    it("returns 401 if password invalid", async () => {
      (authService.login as any).mockImplementationOnce(() => { throw { status: 401, message: "Invalid credentials" }; });
      const req = { body: { username: "existingUser", password: "wrongPassword" } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await authController.loginController(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
    });

    it("sets cookie and returns message on success", async () => {
      (authService.login as any).mockResolvedValueOnce({ message: "Logged in" });
      const req = { body: { username: "loginUser", password: "correctPassword" } } as any;
      const res = { cookie: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await authController.loginController(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: "Logged in" });
    });
  });

  describe("getUserController", () => {
    it("returns 200 and user if token valid", () => {
      (authService.getUserFromToken as any).mockReturnValue({ id: 1, username: "u" });
      const req = { cookies: { token: "token" } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      authController.getUserController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, username: "u" });
    });

    it("returns 401 if token invalid", () => {
      (authService.getUserFromToken as any).mockImplementationOnce(() => { throw { status: 401, message: "Invalid token payload" }; });
      const req = { cookies: { token: "bad" } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      authController.getUserController(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
    });
  });

  describe("logoutController", () => {
    it("returns 200 and logs out", () => {
      (authService.logout as any).mockReturnValue({ message: "Logged out" });
      const req = {} as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn(), clearCookie: vi.fn().mockReturnThis() } as any;
      const next = vi.fn();
      authController.logoutController(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out" });
    });
  });
});
