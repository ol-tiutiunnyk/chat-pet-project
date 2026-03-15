import { renderHook, act } from "@testing-library/react";
import useRegisterForm from "./use-register-form";
import { useRegisterMutation } from "@/slices/auth.api";
import { useNavigate } from "react-router-dom";
import { Mock, vi } from "vitest";

let useRegisterMutationMock = useRegisterMutation as unknown as Mock;
let useNavigateMock = useNavigate as unknown as Mock;

// Mock FormData globally for test isolation
class FormDataMock {
  private _entries: [string, string][];
  constructor({ entries }: { entries: () => [string, string][] }) {
    this._entries = entries() || [];
  }
  append(key: string, value: string) {
    this._entries.push([key, value]);
  }
  entries() {
    return this._entries;
  }
}

vi.stubGlobal("FormData", FormDataMock);

vi.mock("@/slices/auth.api");
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
}));

const createFakeEvent = (username: string, password: string, confirmPassword: string) => {
  return {
    preventDefault: vi.fn(),
    currentTarget: {
      entries: () => [
        ["username", username],
        ["password", password],
        ["confirmPassword", confirmPassword],
      ][Symbol.iterator]()
    }
  } as any;
};

describe("useRegisterForm hook", () => {
  let mockRegister: Mock;
  let mockNavigate: Mock;

  beforeEach(() => {
    mockRegister = vi.fn();
    useRegisterMutationMock.mockReturnValue([
      mockRegister,
      { isLoading: false, isError: false, error: null }
    ]);
    mockNavigate = vi.fn();
    useNavigateMock.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should set local error if username or password is missing and update error/isError", async () => {
    const fakeEvent = createFakeEvent("", "", "");

    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error).toBe("Username and password are required");
    expect(result.current.isError).toBe(true);
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should set local error if passwords do not match", async () => {
    const fakeEvent = createFakeEvent("user", "pass1", "pass2");

    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error).toBe("Passwords do not match");
    expect(result.current.isError).toBe(true);
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should call register and navigate on success, error/isError should be false/empty", async () => {
    mockRegister.mockResolvedValue({ error: undefined });

    const fakeEvent = createFakeEvent("user", "pass", "pass");

    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockRegister).toHaveBeenCalledWith({ username: "user", password: "pass" });
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(result.current.isError).toBe(false);
    expect(result.current.error === "Registration failed" || result.current.error === "").toBe(true);
  });

  it("should not navigate if register returns error, error/isError should reflect API error", async () => {
    useRegisterMutationMock.mockReturnValue([
      mockRegister,
      { isLoading: false, isError: true, error: { message: "fail" } }
    ]);
    mockRegister.mockResolvedValue({ error: { message: "fail" }, isError: true });

    const fakeEvent = createFakeEvent("user", "pass", "pass");

    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.isError).toBe(true);
    expect(typeof result.current.error).toBe("string");
    expect(result.current.error.length).toBeGreaterThan(0);
  });
});
