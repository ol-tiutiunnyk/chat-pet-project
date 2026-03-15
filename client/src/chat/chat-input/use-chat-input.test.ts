vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useParams: () => ({ conversationId: "123" }),
}));
import { renderHook, act } from "@testing-library/react";

import useChatInput from "./use-chat-input";
import { useCreateMessageMutation } from "@/slices/messages.api";
import { Mock, vi } from "vitest";

const useCreateMessageMutationMock = useCreateMessageMutation as unknown as Mock;

vi.mock("@/slices/messages.api");

const createKeyboardEvent = (key: string): React.KeyboardEvent<HTMLInputElement> => {
  return {
    key,
    preventDefault: vi.fn(),
  } as unknown as React.KeyboardEvent<HTMLInputElement>;
};

describe("useChatInput hook", () => {

  let mockCreateMessage: Mock;

  beforeEach(() => {
    mockCreateMessage = vi.fn();
    useCreateMessageMutationMock.mockReturnValue([
      mockCreateMessage,
      { isLoading: false },
    ]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });


  it("should update input value on change", () => {
    const { result } = renderHook(() => useChatInput());

    act(() => {
      result.current.handleInputChange({ target: { value: "hello" } } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.input).toBe("hello");
  });


  it("should call createMessage and clear input on Enter key", async () => {
    mockCreateMessage.mockResolvedValue({});
    const { result } = renderHook(() => useChatInput());

    act(() => {
      result.current.handleInputChange({ target: { value: "test message" } } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleKeyDown(createKeyboardEvent("Enter"));
    });

    expect(mockCreateMessage).toHaveBeenCalled();
    expect(result.current.input).toBe("");
  });


  it("should not call createMessage if input is empty or only spaces", async () => {
    const { result } = renderHook(() => useChatInput());

    act(() => {
      result.current.handleInputChange({ target: { value: "   " } } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleKeyDown(createKeyboardEvent("Enter"));
    });

    expect(mockCreateMessage).not.toHaveBeenCalled();
    expect(result.current.input).toBe("   ");
  });

  it("should not call createMessage on non-Enter key", async () => {
    const { result } = renderHook(() => useChatInput());

    act(() => {
      result.current.handleInputChange({ target: { value: "test" } } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleKeyDown(createKeyboardEvent("a"));
    });

    expect(mockCreateMessage).not.toHaveBeenCalled();
    expect(result.current.input).toBe("test");
  });
});
