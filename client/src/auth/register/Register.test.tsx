import { render, screen, fireEvent } from "@testing-library/react";
import { vi, Mock } from "vitest";
import Register from "./Register";
import useRegisterForm from "./use-register-form";

const useRegisterFormMock = useRegisterForm as unknown as Mock;

vi.mock("react-router-dom", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    Link: ({ to, children }: any) => <a href={typeof to === "string" ? to : "#"} data-testid="mock-link">{children}</a>,
  };
});

vi.mock("./use-register-form", () => ({
  __esModule: true,
  default: vi.fn(),
}));

function setupHookMock(overrides = {}) {
  const base = {
    handleSubmit: vi.fn((e) => e.preventDefault()),
    isLoading: false,
    isError: false,
    error: "",
    setLocalError: vi.fn(),
  };
  useRegisterFormMock.mockReturnValue({ ...base, ...overrides });
}

describe("Register component", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders register form fields and button", () => {
    setupHookMock();

    render(<Register />);

    expect(screen.getByRole("heading", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("calls handleSubmit on form submit", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    setupHookMock({ handleSubmit });

    render(<Register />);
    fireEvent.submit(screen.getByRole("form"));

    expect(handleSubmit).toHaveBeenCalled();
  });

  it("disables button and shows loading text when isLoading", () => {
    setupHookMock({ isLoading: true });

    render(<Register />);

    const button = screen.getByRole("button", { name: /registering/i });
    expect(button).toBeDisabled();
  });

  it("shows error message when isError is true", () => {
    setupHookMock({ isError: true, error: "Registration failed" });

    render(<Register />);

    expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
  });
});
