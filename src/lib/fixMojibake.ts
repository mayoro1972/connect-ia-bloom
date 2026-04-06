const suspiciousEncodingPattern = /Ã|Â|â|ð/;

export const fixMojibake = (value: string): string => {
  if (!suspiciousEncodingPattern.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(Array.from(value, (char) => char.charCodeAt(0) & 0xff));
    const decoded = new TextDecoder("utf-8").decode(bytes);

    return decoded.includes("�") ? value : decoded;
  } catch {
    return value;
  }
};

export const deepFixMojibake = <T>(value: T): T => {
  if (typeof value === "string") {
    return fixMojibake(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepFixMojibake(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [fixMojibake(key), deepFixMojibake(item)]),
    ) as T;
  }

  return value;
};
