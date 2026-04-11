const DEFAULT_TIME_ZONE = "Africa/Abidjan";

const getHourInTimeZone = (date: Date, timeZone = DEFAULT_TIME_ZONE) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    timeZone,
  });

  return Number.parseInt(formatter.format(date), 10);
};

export const getEmailGreeting = (
  language: "fr" | "en" = "fr",
  recipientName?: string | null,
  date: Date = new Date(),
  timeZone = DEFAULT_TIME_ZONE,
) => {
  const hour = getHourInTimeZone(date, timeZone);
  const normalizedName = recipientName?.trim();
  const baseGreeting = language === "fr"
    ? hour < 12 ? "Bonjour" : "Bonsoir"
    : hour < 12 ? "Good morning" : "Good evening";

  return normalizedName ? `${baseGreeting} ${normalizedName},` : `${baseGreeting},`;
};

export const replaceLeadingGreeting = (
  body: string,
  nextGreeting: string,
) => {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    return nextGreeting;
  }

  const patterns = [
    /^(Bonjour|Bonsoir)\s+[^\n,]+,?/i,
    /^(Bonjour|Bonsoir),?/i,
    /^(Hello|Good morning|Good evening)\s+[^\n,]+,?/i,
    /^(Hello|Good morning|Good evening),?/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(trimmedBody)) {
      return trimmedBody.replace(pattern, nextGreeting);
    }
  }

  return `${nextGreeting}\n\n${trimmedBody}`;
};
