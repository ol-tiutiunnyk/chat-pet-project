import { render } from "@testing-library/react";
import App from "./App";

describe("Root render", () => {
  it("renders App without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });
});
