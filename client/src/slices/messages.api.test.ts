import { describe, it, expect } from "vitest";
import { messagesApi } from "@/slices/messages.api";

// Unit test for the API slice endpoints

describe("messagesApi endpoints", () => {
  it("should have getMessages endpoint", () => {
    expect(messagesApi.endpoints).toHaveProperty("getMessages");
  });
  it("should have createMessage endpoint", () => {
    expect(messagesApi.endpoints).toHaveProperty("createMessage");
  });
  it("should have updateMessage endpoint", () => {
    expect(messagesApi.endpoints).toHaveProperty("updateMessage");
  });
  it("should have deleteMessage endpoint", () => {
    expect(messagesApi.endpoints).toHaveProperty("deleteMessage");
  });
});
