import fs from "node:fs/promises";

const ROOT = "/Users/marius_ayoro/Documents/GitHub/connect-ia-bloom";
const SPEC_PATH = process.env.TRANSFERAI_SECTOR_SPEC;

if (!SPEC_PATH) {
  throw new Error("TRANSFERAI_SECTOR_SPEC is required");
}

export const spec = JSON.parse(await fs.readFile(SPEC_PATH, "utf8"));

export const assets = {
  logo: `${ROOT}/src/assets/logo-transferai-nettelecom.png`,
};

export const theme = {
  bg: "#F5EFE7",
  panel: "#FFFDFC",
  panelAlt: "#FBF5EE",
  ink: "#1A3554",
  soft: "#617086",
  orange: "#E76F1D",
  navy: "#163556",
  teal: "#1C8A78",
  mint: "#E7F2EE",
  sand: "#EFE2D2",
  gold: "#C88C3A",
  line: "#D7CEC3",
  white: "#FFFFFF",
  darkSoft: "#C9D4E1",
  accent: spec.accentColor ?? "#E76F1D",
};

function joinLines(items) {
  return items.filter(Boolean).join("\n");
}

export function text(slide, ctx, value, x, y, w, h, opts = {}) {
  return ctx.addText(slide, {
    text: String(value ?? ""),
    left: x,
    top: y,
    width: w,
    height: h,
    fontSize: opts.size ?? 18,
    color: opts.color ?? theme.ink,
    bold: Boolean(opts.bold),
    typeface: opts.face ?? ctx.fonts.body,
    align: opts.align ?? "left",
    valign: opts.valign ?? "top",
    fill: opts.fill ?? "#00000000",
    line: opts.line ?? ctx.line(),
    insets: opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function rect(slide, ctx, x, y, w, h, fill, opts = {}) {
  return ctx.addShape(slide, {
    left: x,
    top: y,
    width: w,
    height: h,
    geometry: opts.geometry ?? "rect",
    fill,
    line: opts.line ?? ctx.line(),
  });
}

export function bg(slide, ctx, fill = theme.bg) {
  rect(slide, ctx, 0, 0, ctx.W, ctx.H, fill, {
    line: ctx.line(fill, 0),
  });
}

export function footer(slide, ctx, page, note = `TransferAI | Deck sectoriel ${spec.title}`) {
  rect(slide, ctx, 68, 682, 1144, 1, theme.line, { line: ctx.line(theme.line, 0) });
  text(slide, ctx, note, 72, 690, 950, 16, { size: 8.5, color: theme.soft });
  text(slide, ctx, String(page).padStart(2, "0"), 1160, 688, 36, 18, {
    size: 10,
    color: theme.ink,
    bold: true,
    align: "right",
  });
}

export function kicker(slide, ctx, value, x = 72, y = 52, color = theme.accent) {
  text(slide, ctx, String(value).toUpperCase(), x, y, 300, 18, {
    size: 10.5,
    color,
    bold: true,
  });
}

export function title(slide, ctx, value, x, y, w, h, size = 32, color = theme.ink) {
  return text(slide, ctx, value, x, y, w, h, {
    size,
    color,
    bold: true,
    face: ctx.fonts.title,
  });
}

export function body(slide, ctx, value, x, y, w, h, size = 15, color = theme.soft, opts = {}) {
  return text(slide, ctx, value, x, y, w, h, {
    size,
    color,
    ...opts,
  });
}

export function card(slide, ctx, x, y, w, h, opts = {}) {
  return rect(slide, ctx, x, y, w, h, opts.fill ?? theme.panel, {
    line: ctx.line(opts.border ?? theme.line, opts.borderWidth ?? 1),
    geometry: opts.geometry ?? "roundRect",
  });
}

export async function addLogo(slide, ctx, x, y, w = 180, h = 52) {
  await ctx.addImage(slide, {
    path: assets.logo,
    left: x,
    top: y,
    width: w,
    height: h,
    fit: "contain",
    alt: "TransferAI x NettelecomCI",
  });
}

export function metricCard(slide, ctx, x, y, w, h, accent, value, label) {
  const valueText = String(value ?? "");
  const valueSize = valueText.length > 12 ? 13.5 : valueText.length > 8 ? 16 : 21;
  const labelTop = valueText.length > 8 ? y + 58 : y + 46;
  card(slide, ctx, x, y, w, h, { fill: theme.panel, border: theme.line });
  rect(slide, ctx, x + 18, y + 18, 4, h - 36, accent, {
    line: ctx.line(accent, 0),
  });
  text(slide, ctx, valueText, x + 34, y + 16, w - 46, 34, {
    size: valueSize,
    color: theme.ink,
    bold: true,
    face: ctx.fonts.title,
  });
  text(slide, ctx, label, x + 34, labelTop, w - 46, 24, {
    size: 9.8,
    color: theme.soft,
    bold: true,
  });
}

export function pill(slide, ctx, value, x, y, w, fill = theme.panelAlt) {
  rect(slide, ctx, x, y, w, 24, fill, {
    geometry: "roundRect",
    line: ctx.line(theme.line, 1),
  });
  text(slide, ctx, value, x + 10, y + 6, w - 20, 12, {
    size: 9.4,
    color: theme.ink,
    bold: true,
    align: "center",
  });
}

export function drawPills(slide, ctx, values, x, y, columns = 2, width = 232, gapX = 14, gapY = 10) {
  values.forEach((value, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    pill(slide, ctx, value, x + col * (width + gapX), y + row * (24 + gapY), width);
  });
}

export function bulletLines(values) {
  return joinLines(values.map((value) => `• ${value}`));
}

export function bulletBlock(slide, ctx, values, x, y, w, h, opts = {}) {
  body(slide, ctx, bulletLines(values), x, y, w, h, opts.size ?? 12.5, opts.color ?? theme.ink, {
    valign: "top",
  });
}

export function priorityCard(slide, ctx, item, x, y, w, h, accent = theme.accent) {
  card(slide, ctx, x, y, w, h, { fill: theme.panel });
  rect(slide, ctx, x + 18, y + 20, 5, h - 40, accent, { line: ctx.line(accent, 0) });
  title(slide, ctx, item.title, x + 38, y + 18, w - 56, 32, 16, theme.ink);
  text(slide, ctx, "AVANT", x + 38, y + 56, 60, 14, { size: 8.8, color: theme.orange, bold: true });
  body(slide, ctx, item.before, x + 38, y + 74, w - 56, 44, 11, theme.soft);
  text(slide, ctx, "APRÈS", x + 38, y + 124, 60, 14, { size: 8.8, color: theme.teal, bold: true });
  body(slide, ctx, item.after, x + 38, y + 142, w - 56, h - 158, 11, theme.ink);
}

export function roiCard(slide, ctx, item, x, y, w, h) {
  const valueText = String(item.value ?? "");
  const valueSize = valueText.length > 14 ? 14 : valueText.length > 10 ? 16 : 20;
  rect(slide, ctx, x, y, w, h, theme.accent, {
    geometry: "roundRect",
    line: ctx.line(theme.accent, 0),
  });
  text(slide, ctx, valueText, x + 18, y + 16, w - 36, 38, {
    size: valueSize,
    color: theme.white,
    bold: true,
    face: ctx.fonts.title,
    align: "center",
  });
  text(slide, ctx, item.label, x + 18, y + 54, w - 36, 40, {
    size: 8,
    color: theme.white,
    bold: true,
    align: "center",
  });
  body(slide, ctx, item.note, x + 18, y + 98, w - 36, 16, 8.1, theme.white, {
    align: "center",
  });
}

export function useCaseCard(slide, ctx, item, x, y, w, h, accent = theme.accent) {
  card(slide, ctx, x, y, w, h, { fill: theme.panel });
  rect(slide, ctx, x + 18, y + 18, 38, 6, accent, { line: ctx.line(accent, 0) });
  title(slide, ctx, item.title, x + 18, y + 34, w - 36, 32, 15);
  text(slide, ctx, "AVANT", x + 18, y + 72, 64, 12, { size: 8.6, color: theme.orange, bold: true });
  body(slide, ctx, item.before, x + 18, y + 88, w - 36, 34, 10.3, theme.soft);
  text(slide, ctx, "APRÈS", x + 18, y + 126, 64, 12, { size: 8.6, color: theme.teal, bold: true });
  body(slide, ctx, item.after, x + 18, y + 142, w - 36, 34, 10.3, theme.ink);
  rect(slide, ctx, x + 18, y + h - 42, w - 36, 1, theme.line, { line: ctx.line(theme.line, 0) });
  body(slide, ctx, `KPI à suivre : ${item.kpi}`, x + 18, y + h - 34, w - 36, 20, 9.3, theme.soft, {
    bold: true,
  });
}

export function offerCard(slide, ctx, item, x, y, w, h, accent = theme.accent) {
  card(slide, ctx, x, y, w, h, { fill: theme.panel });
  rect(slide, ctx, x + 18, y + 20, 52, 18, accent, {
    geometry: "roundRect",
    line: ctx.line(accent, 0),
  });
  text(slide, ctx, item.title, x + 82, y + 18, w - 100, 22, {
    size: 13,
    color: theme.ink,
    bold: true,
    face: ctx.fonts.title,
  });
  body(slide, ctx, item.promise, x + 18, y + 52, w - 36, 46, 10.8, theme.ink);
  bulletBlock(slide, ctx, item.items, x + 18, y + 100, w - 36, h - 114, { size: 10.2, color: theme.soft });
}

export function timelineCard(slide, ctx, item, x, y, w, h, accent = theme.accent) {
  card(slide, ctx, x, y, w, h, { fill: theme.panelAlt });
  rect(slide, ctx, x + 18, y + 18, 60, 24, accent, {
    geometry: "roundRect",
    line: ctx.line(accent, 0),
  });
  text(slide, ctx, item.step, x + 18, y + 24, 60, 12, {
    size: 10,
    color: theme.white,
    bold: true,
    align: "center",
  });
  title(slide, ctx, item.title, x + 18, y + 56, w - 36, 30, 14.5);
  body(slide, ctx, item.desc, x + 18, y + 92, w - 36, h - 110, 10.6, theme.soft);
}

export function sectionBand(slide, ctx, titleText, copy, x = 72, y = 86, w = 1136, h = 126) {
  card(slide, ctx, x, y, w, h, { fill: theme.panelAlt, border: theme.line });
  rect(slide, ctx, x + 24, y + 22, 6, h - 44, theme.accent, { line: ctx.line(theme.accent, 0) });
  title(slide, ctx, titleText, x + 46, y + 18, 560, 32, 24);
  body(slide, ctx, copy, x + 46, y + 58, w - 80, 46, 12.5, theme.soft);
}
