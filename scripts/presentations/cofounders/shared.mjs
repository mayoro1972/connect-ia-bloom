import fs from "node:fs/promises";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const DATA_PATH = `${ROOT}/docs/transferai-prospection/cofounders-pack-data.json`;

let cachedData;

export const palette = {
  bg: "#F7F3EE",
  paper: "#FFFDFC",
  ink: "#12355B",
  inkSoft: "#4C5B6A",
  accent: "#D66724",
  accentSoft: "#F4D8C6",
  line: "#D9D3CC",
  tier1: "#D66724",
  tier2: "#3E7C78",
  tier3: "#7E8B99",
  dark: "#16324F"
};

export async function loadData() {
  if (!cachedData) {
    cachedData = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
  }
  return cachedData;
}

export function tierColor(tier) {
  if (tier === "Tier 1") return palette.tier1;
  if (tier === "Tier 2") return palette.tier2;
  return palette.tier3;
}

export function fullBleed(slide, ctx, fill = palette.bg) {
  ctx.addShape(slide, {
    x: 0,
    y: 0,
    width: ctx.W,
    height: ctx.H,
    fill,
    line: ctx.line(fill, 0)
  });
}

export function rule(slide, ctx, x, y, width, fill = palette.line, height = 2) {
  ctx.addShape(slide, {
    x,
    y,
    width,
    height,
    fill,
    line: ctx.line(fill, 0)
  });
}

export function panel(slide, ctx, x, y, width, height, options = {}) {
  const fill = options.fill ?? palette.paper;
  const stroke = options.stroke ?? fill;
  return ctx.addShape(slide, {
    x,
    y,
    width,
    height,
    fill,
    line: ctx.line(stroke, options.lineWidth ?? 1)
  });
}

export function title(slide, ctx, text, x, y, width, height, size = 30) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    width,
    height,
    size,
    bold: true,
    color: palette.ink,
    face: "Aptos Display"
  });
}

export function kicker(slide, ctx, text, x = 60, y = 36, width = 300) {
  ctx.addText(slide, {
    text: text.toUpperCase(),
    x,
    y,
    width,
    height: 18,
    size: 10,
    bold: true,
    color: palette.accent
  });
}

export function body(slide, ctx, text, x, y, width, height, size = 15, options = {}) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    width,
    height,
    size,
    color: options.color ?? palette.inkSoft,
    bold: options.bold ?? false,
    face: options.face ?? "Aptos",
    align: options.align ?? "left"
  });
}

export function bulletList(slide, ctx, items, x, y, width, options = {}) {
  const gap = options.gap ?? 36;
  const size = options.size ?? 16;
  items.forEach((item, index) => {
    ctx.addText(slide, {
      text: "•",
      x,
      y: y + index * gap,
      width: 18,
      height: 20,
      size,
      bold: true,
      color: options.bulletColor ?? palette.accent
    });
    ctx.addText(slide, {
      text: item,
      x: x + 22,
      y: y + index * gap - 2,
      width: width - 22,
      height: options.itemHeight ?? 34,
      size,
      color: options.color ?? palette.inkSoft,
      face: "Aptos"
    });
  });
}

export function metricCard(slide, ctx, x, y, width, height, value, label, note, color) {
  panel(slide, ctx, x, y, width, height, { fill: palette.paper, stroke: palette.line });
  rule(slide, ctx, x + 18, y + 16, 4, color, 48);
  ctx.addText(slide, {
    text: value,
    x: x + 34,
    y: y + 12,
    width: width - 52,
    height: 34,
    size: 28,
    bold: true,
    face: "Aptos Display",
    color: palette.ink
  });
  ctx.addText(slide, {
    text: label,
    x: x + 34,
    y: y + 48,
    width: width - 52,
    height: 20,
    size: 11,
    bold: true,
    color: palette.inkSoft
  });
  ctx.addText(slide, {
    text: note,
    x: x + 34,
    y: y + 68,
    width: width - 52,
    height: 22,
    size: 10,
    color: palette.inkSoft
  });
}

export function chip(slide, ctx, x, y, width, text, color = palette.paper, textColor = palette.ink) {
  panel(slide, ctx, x, y, width, 30, { fill: color, stroke: color });
  ctx.addText(slide, {
    text,
    x,
    y: y + 6,
    width,
    height: 18,
    size: 10.5,
    bold: true,
    color: textColor,
    align: "center"
  });
}

export function footer(slide, ctx, slideNo, text) {
  rule(slide, ctx, 60, 680, 1160, palette.line, 1);
  ctx.addText(slide, {
    text,
    x: 60,
    y: 689,
    width: 950,
    height: 16,
    size: 9,
    color: palette.inkSoft
  });
  ctx.addText(slide, {
    text: String(slideNo).padStart(2, "0"),
    x: 1140,
    y: 686,
    width: 60,
    height: 20,
    size: 11,
    bold: true,
    color: palette.ink,
    align: "right"
  });
}

export function domainCard(slide, ctx, x, y, width, height, item) {
  panel(slide, ctx, x, y, width, height, { fill: palette.paper, stroke: palette.line });
  chip(slide, ctx, x + 18, y + 16, 76, item.tier, tierColor(item.tier), "#FFFFFF");
  title(slide, ctx, item.domain, x + 18, y + 52, width - 36, 52, 18);
  body(slide, ctx, item.flagshipUseCase, x + 18, y + 106, width - 36, 48, 12.5, { color: palette.inkSoft });
  body(slide, ctx, item.roiStory ?? item.roi, x + 18, y + height - 54, width - 36, 42, 11, { color: palette.accent, bold: true });
}

export function smallDomainPill(slide, ctx, x, y, text, color) {
  panel(slide, ctx, x, y, 210, 28, { fill: color, stroke: color });
  ctx.addText(slide, {
    text,
    x,
    y: y + 6,
    width: 210,
    height: 16,
    size: 10.5,
    bold: true,
    color: "#FFFFFF",
    align: "center"
  });
}
