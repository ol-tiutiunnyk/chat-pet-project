import { renderHook, act } from "@testing-library/react";
import useLoginForm from "./use-login-form";
import { useLoginMutation } from "@/slices/auth.api";
import { useNavigate } from "react-router-dom";
import { Mock, vi } from "vitest";

let useLoginMutationMock = useLoginMutation as unknown as Mock;
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

const createFakeEvent = (username: string, password: string) => {
  return {
    preventDefault: vi.fn(),
    currentTarget: {
      entries: () => [["username", username], ["password", password]][Symbol.iterator]()
    }
  } as any;
}

describe("useLogin hook", () => {
  let mockLogin: Mock;
  let mockNavigate: Mock;

  beforeEach(() => {
    mockLogin = vi.fn();
    useLoginMutationMock.mockReturnValue([mockLogin, { isLoading: false, isError: false, error: null }]);
    mockNavigate = vi.fn();
    useNavigateMock.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should set local error if username or password is missing and update error/isError", async () => {
    const fakeEvent = createFakeEvent("", "");

    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error).toBe("Username and password are required");
    expect(result.current.isError).toBe(true);
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should call login and navigate on success, error/isError should be false/empty", async () => {
    mockLogin.mockResolvedValue({ error: undefined });
    const fakeEvent = createFakeEvent("user", "pass");

    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockLogin).toHaveBeenCalledWith({ username: "user", password: "pass" });
    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(result.current.isError).toBe(false);
    // error should be "Login failed" only if isError is true
    expect(result.current.error === "Login failed" || result.current.error === "").toBe(true);
  });

  it("should not navigate if login returns error, error/isError should reflect API error", async () => {
    useLoginMutationMock.mockReturnValue([mockLogin, { isLoading: false, isError: true, error: { message: "fail" } }]);
    mockLogin.mockResolvedValue({ error: { message: "fail" }, isError: true });
    const fakeEvent = createFakeEvent("user", "pass");

    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.isError).toBe(true);
    // error should be a string (from mapApiErrorToString or fallback)
    expect(typeof result.current.error).toBe("string");
    expect(result.current.error.length).toBeGreaterThan(0);
  });
});
