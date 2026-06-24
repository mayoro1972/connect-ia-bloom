export const THEME = {
  bg: "#F6F1EA",
  surface: "#FFFDFC",
  surfaceAlt: "#EFE5D8",
  ink: "#17263E",
  muted: "#5C6777",
  accent: "#DE6A1F",
  accent2: "#1D8A78",
  accent3: "#D9D1C6",
  dark: "#102338",
  darkSoft: "#D7E1EE",
  white: "#FFFFFF",
  serif: "Georgia",
  sans: "Avenir Next",
};

export function text(slide, ctx, value, left, top, width, height, opts = {}) {
  return ctx.addText(slide, {
    text: String(value ?? ""),
    left,
    top,
    width,
    height,
    fontSize: opts.size ?? 18,
    color: opts.color ?? THEME.ink,
    bold: Boolean(opts.bold),
    typeface: opts.face ?? THEME.sans,
    align: opts.align ?? "left",
    valign: opts.valign ?? "top",
    fill: opts.fill ?? "#00000000",
    line: opts.line ?? ctx.line(),
    insets: opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
    name: opts.name,
  });
}

export function rect(slide, ctx, left, top, width, height, fill, opts = {}) {
  return ctx.addShape(slide, {
    left,
    top,
    width,
    height,
    geometry: opts.geometry ?? "rect",
    fill,
    line: opts.line ?? ctx.line(),
    name: opts.name,
  });
}

export function rule(slide, ctx, left, top, width, color, weight = 1) {
  return rect(slide, ctx, left, top, width, weight, color);
}

export function bg(slide, ctx, fill = THEME.bg) {
  rect(slide, ctx, 0, 0, ctx.W, ctx.H, fill);
}

export function wrap(value, maxChars = 56, maxLines = 4) {
  const words = String(value || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
    if (lines.length >= maxLines) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (words.length && lines.join(" ").length < words.join(" ").length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,;:]?$/, "")}...`;
  }
  return lines.join("\n");
}

export function footer(slide, ctx, page, label = "TransferAI Africa | Offre ciblée ELTON Oil CI | Document de travail") {
  rule(slide, ctx, 58, 682, 1164, THEME.accent3, 1);
  text(slide, ctx, label, 58, 689, 920, 14, { size: 7.5, color: THEME.muted });
  text(slide, ctx, String(page).padStart(2, "0"), 1180, 685, 44, 18, {
    size: 11,
    color: THEME.muted,
    face: THEME.serif,
    bold: true,
    align: "right",
  });
}

export function kicker(slide, ctx, label, x = 58, y = 48, color = THEME.accent) {
  rect(slide, ctx, x, y + 3, 10, 10, color);
  text(slide, ctx, label.toUpperCase().split("").join(" "), x + 22, y, 460, 18, {
    size: 9.5,
    color: THEME.muted,
    bold: true,
  });
}

export function title(slide, ctx, value, x = 58, y = 84, w = 860, h = 96, size = 34, color = THEME.ink) {
  text(slide, ctx, value, x, y, w, h, {
    size,
    color,
    face: THEME.serif,
    bold: true,
  });
}

export function paragraph(slide, ctx, value, x, y, w, h, opts = {}) {
  return text(slide, ctx, value, x, y, w, h, {
    size: opts.size ?? 14,
    color: opts.color ?? THEME.muted,
    face: opts.face ?? THEME.sans,
    bold: opts.bold ?? false,
    align: opts.align ?? "left",
    valign: opts.valign ?? "top",
    insets: opts.insets,
  });
}

export function card(slide, ctx, x, y, w, h, opts = {}) {
  const fill = opts.fill ?? THEME.surface;
  const lineColor = opts.lineColor ?? THEME.accent3;
  rect(slide, ctx, x, y, w, h, fill, { line: ctx.line(lineColor, opts.lineWidth ?? 1) });
  if (opts.barColor) {
    rect(slide, ctx, x, y, 8, h, opts.barColor);
  }
}

export function metricRail(slide, ctx, x, y, metrics) {
  metrics.forEach((metric, index) => {
    const xx = x + index * 282;
    rule(slide, ctx, xx, y - 6, 1, metric.color ?? (index % 2 ? THEME.accent2 : THEME.accent), 60);
    text(slide, ctx, metric.value, xx + 16, y, 170, 36, {
      size: 27,
      color: THEME.ink,
      face: THEME.serif,
      bold: true,
    });
    text(slide, ctx, metric.label, xx + 16, y + 40, 180, 18, {
      size: 9.5,
      color: THEME.muted,
      bold: true,
    });
    text(slide, ctx, metric.note, xx + 16, y + 58, 210, 24, {
      size: 8.5,
      color: THEME.muted,
    });
  });
}

export function bulletLines(items) {
  return items.map((item) => `• ${item}`).join("\n");
}
