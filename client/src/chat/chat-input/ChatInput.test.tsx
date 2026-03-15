import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ChatInput from "./ChatInput";
import * as useChatInputModule from "./use-chat-input";
import * as authApi from "@/slices/auth.api";

vi.mock("@/slices/auth.api");

function setupHookMock(overrides = {}) {
  const base = {
    input: "",
    handleInputChange: vi.fn(),
    handleKeyDown: vi.fn(),
    isLoading: false,
    inputRef: { current: null },
  };
  vi.spyOn(useChatInputModule, "default").mockReturnValue({ ...base, ...overrides });
}

describe("ChatInput component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders skeleton when user is loading", () => {
    vi.spyOn(authApi, "useGetUserQuery").mockReturnValue({ isLoading: true } as any);
    setupHookMock();
    
    render(<ChatInput />);
    
    expect(screen.getByTestId("skeleton-input")).toBeInTheDocument();
  });

  it("renders input and passes props", () => {
    vi.spyOn(authApi, "useGetUserQuery").mockReturnValue({ isLoading: false } as any);
    setupHookMock({ input: "hello" });
    
    render(<ChatInput />);
    
    const input = screen.getByPlaceholderText(/type a message/i);
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("hello");
  });

  it("calls handleInputChange and handleKeyDown", () => {
    vi.spyOn(authApi, "useGetUserQuery").mockReturnValue({ isLoading: false } as any);
    const handleInputChange = vi.fn();
    const handleKeyDown = vi.fn();
    setupHookMock({ handleInputChange, handleKeyDown });
    
    render(<ChatInput />);
    
    const input = screen.getByPlaceholderText(/type a message/i);
    
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter" });
    
    expect(handleInputChange).toHaveBeenCalled();
    expect(handleKeyDown).toHaveBeenCalled();
  });

  it("disables input when isLoading", () => {
    vi.spyOn(authApi, "useGetUserQuery").mockReturnValue({ isLoading: false } as any);
    setupHookMock({ isLoading: true });
    
    render(<ChatInput />);
    
    const input = screen.getByPlaceholderText(/type a message/i);
    expect(input).toBeDisabled();
  });
});
