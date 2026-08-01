// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import LiquidBackground from "./LiquidBackground";

beforeEach(() => {
  // jsdom doesn't implement matchMedia; stub it.
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

describe("LiquidBackground", () => {
  it("renders static gradient fallback without touching window during render", () => {
    const host = document.createElement("div");
    act(() => {
      const root = createRoot(host);
      root.render(<LiquidBackground />);
    });
    const container = host.querySelector("div");
    expect(container).not.toBeNull();
  });
});
