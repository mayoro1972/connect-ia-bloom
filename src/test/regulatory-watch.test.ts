import { describe, expect, it } from "vitest";
import {
  isRegulatoryWatchCandidate,
  resolveRegulatoryImpactLevel,
  resolveRegulatoryJurisdiction,
} from "@/lib/regulatory-watch";
import type { ResourceFeedItem } from "@/lib/resource-feed";

const baseItem: ResourceFeedItem = {
  id: "reg-1",
  slug: "reg-1",
  categoryKey: "veille",
  sectorKey: "Finance & Fintech",
  titleFr: "Note de conformité IA pour banque",
  titleEn: "AI compliance note for banking",
  excerptFr: "Résumé",
  excerptEn: "Summary",
  readTimeMinutes: 5,
  publishedAt: "2026-05-09T10:00:00.000Z",
  sourceName: "BCEAO",
  sourceUrl: "https://example.com",
  tags: [],
  isFeatured: false,
  isNewManual: true,
};

describe("regulatory watch helpers", () => {
  it("detects a banking regulatory candidate", () => {
    expect(isRegulatoryWatchCandidate(baseItem)).toBe(true);
  });

  it("prioritizes explicit taxonomy tags for jurisdiction and impact", () => {
    const taggedItem: ResourceFeedItem = {
      ...baseItem,
      tags: ["jurisdiction:uemoa-bceao", "impact:high"],
    };

    expect(resolveRegulatoryJurisdiction(taggedItem)).toBe("uemoa-bceao");
    expect(resolveRegulatoryImpactLevel(taggedItem)).toBe("high");
  });
});
