import { describe, it, expect, beforeEach, vi } from "vitest";
import * as conversationsApi from "@/slices/conversations.api";
import * as authApi from "@/slices/auth.api";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock all components used in the router for isolation
vi.mock("@/auth", () => ({
  Register: () => <div>RegisterMock</div>,
  Login: () => <div>LoginMock</div>,
  RequireAuth: ({ children }: any) => <>{children}</>,
  RedirectIfAuth: ({ children }: any) => <>{children}</>,
}));
vi.mock("@/chat", () => ({
  Chat: () => <div>ChatMock</div>,
}));
vi.mock("@/conversations", () => ({
  __esModule: true,
  Conversations: () => <div>ConversationsListMock</div>,
}));

describe("App", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders conversations list on /", () => {
    window.history.pushState({}, "Conversations", "/");
    render(
      <App />
    );
    expect(screen.getByText("ConversationsListMock")).toBeInTheDocument();
  });

  it("renders chat route for /chat/:conversationId", () => {
    window.history.pushState({}, "Chat", "/chat/1");
    render(
      <App />
    );
    expect(screen.getByText("ChatMock")).toBeInTheDocument();
  });

  it("redirects to login if not authenticated", () => {
    window.history.pushState({}, "Login", "/login");
    render(
      <App />
    );
    expect(screen.getByText("LoginMock")).toBeInTheDocument();
  });

  it("redirects to register if not authenticated", () => {
    window.history.pushState({}, "Register", "/register");
    render(
      <App />
    );
    expect(screen.getByText("RegisterMock")).toBeInTheDocument();
  });
});
