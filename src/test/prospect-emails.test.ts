import { beforeEach, describe, expect, it } from "vitest";
import { resolveOutboundLanguage } from "@/lib/prospect-emails";

describe("resolveOutboundLanguage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = "";
    document.body.removeAttribute("data-language");
  });

  it("prefers the explicit payload language when present", () => {
    document.documentElement.lang = "fr";
    window.localStorage.setItem("transferai-language", "fr");

    expect(resolveOutboundLanguage("en")).toBe("en");
  });

  it("falls back to document and storage language markers", () => {
    document.documentElement.lang = "en";
    expect(resolveOutboundLanguage()).toBe("en");

    document.documentElement.lang = "";
    document.body.setAttribute("data-language", "en");
    expect(resolveOutboundLanguage()).toBe("en");

    document.body.removeAttribute("data-language");
    window.localStorage.setItem("transferai-language", "en");
    expect(resolveOutboundLanguage()).toBe("en");
  });

  it("defaults to french when no english marker is found", () => {
    expect(resolveOutboundLanguage()).toBe("fr");
  });
});
