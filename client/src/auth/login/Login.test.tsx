import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, Mock } from "vitest";
import Login from "./Login";
import useLoginForm from "./use-login-form";

const useLoginFormMock  = useLoginForm as unknown as Mock;

const setupHookMock = (overrides = {}) => {
  const base = {
    handleSubmit: vi.fn((e) => e.preventDefault()),
    isLoading: false,
    isError: false,
    error: "",
    setLocalError: vi.fn(),
  };
  useLoginFormMock.mockReturnValue({ ...base, ...overrides });
}

vi.mock("./use-login-form", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    Link: ({ to, children }: any) => <a href={typeof to === "string" ? to : "#"} data-testid="mock-link">{children}</a>,
  };
});

describe("Login component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders login form fields and button", () => {
    setupHookMock();

    render(<Login />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
  });

  it("calls handleSubmit on form submit", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    setupHookMock({ handleSubmit });

    render(<Login />);
    fireEvent.submit(screen.getByRole("form"));

    expect(handleSubmit).toHaveBeenCalled();
  });

  it("disables button and shows loading text when isLoading", () => {
    setupHookMock({ isLoading: true });

    render(<Login />);

    const button = screen.getByRole("button", { name: /logging in/i });
    expect(button).toBeDisabled();
  });

  it("shows error message when isError is true", () => {
    setupHookMock({ isError: true, error: "Invalid credentials" });

    render(<Login />);

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
