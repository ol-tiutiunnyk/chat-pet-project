import { isAuthToken } from "./auth-token.model";
import { it, describe, expect } from "vitest";

describe("auth-token.model", () => {
  it("returns true for valid AuthToken", () => {
    expect(
      isAuthToken({ id: 1, username: "mockedUser" })
    ).toBe(true);
    expect(
      isAuthToken({ id: 1, username: "mockedUser", iat: 123, exp: 456 })
    ).toBe(true);
  });

  it("returns false for invalid token", () => {
    expect(isAuthToken(null)).toBe(false);
    expect(isAuthToken({})).toBe(false);
    expect(isAuthToken({ id: "1", username: "mockedUser" })).toBe(false);
    expect(isAuthToken({ id: 1, username: 2 })).toBe(false);
    expect(isAuthToken({ id: 1 })).toBe(false);
  });
});
