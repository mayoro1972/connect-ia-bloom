import { describe, expect, it } from "vitest";
import { deepFixMojibake, fixMojibake } from "@/lib/fixMojibake";

describe("fixMojibake helpers", () => {
  it("repairs malformed strings", () => {
    expect(fixMojibake("DÃ©butant")).toBe("Débutant");
    expect(fixMojibake("ConfÃ©rence")).toBe("Conférence");
  });

  it("repairs malformed object keys as well as values", () => {
    const fixed = deepFixMojibake({
      "DÃ©butant": {
        label: "Niveau DÃ©butant",
      },
    });

    expect(fixed).toEqual({
      "Débutant": {
        label: "Niveau Débutant",
      },
    });
  });
});
