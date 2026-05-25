import { afterEach, describe, expect, it, vi } from "vitest";

describe("resource weekly headlines", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
  });

  it("builds weekly OpenAI and Claude featured items with dynamic dates", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-22T12:00:00.000Z"));

    const { resourceFeedFallback, getFallbackResourcePostBySlug, isWeeklyHeadlineResource } = await import("@/lib/resource-feed");

    const weeklyItems = resourceFeedFallback.filter(isWeeklyHeadlineResource);
    const openaiItem = weeklyItems.find((item) => item.slug === "a-la-une-openai-semaine");
    const claudeItem = weeklyItems.find((item) => item.slug === "a-la-une-claude-semaine");

    expect(weeklyItems).toHaveLength(2);
    expect(openaiItem?.sourceName).toBe("OpenAI");
    expect(openaiItem?.publishedAt).toBe("2026-05-19T09:00:00.000Z");
    expect(claudeItem?.sourceName).toBe("Claude");
    expect(claudeItem?.publishedAt).toBe("2026-05-21T09:00:00.000Z");

    const openaiPost = getFallbackResourcePostBySlug("a-la-une-openai-semaine");
    const claudePost = getFallbackResourcePostBySlug("a-la-une-claude-semaine");

    expect(openaiPost?.contentFr).toContain("Semaine suivie");
    expect(openaiPost?.sources).toHaveLength(2);
    expect(claudePost?.contentFr).toContain("Cette note \"À la une\" suit l'écosystème Claude");
    expect(claudePost?.sources).toHaveLength(2);
  });
});
