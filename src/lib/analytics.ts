type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
    umami?: {
      track: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}

const sanitizeParams = (params: AnalyticsParams) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));

export const trackAnalyticsEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const payload = sanitizeParams({
    ...params,
    page_path: params.page_path ?? window.location.pathname,
    timestamp: new Date().toISOString(),
  });

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: eventName, ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }

  if (typeof window.plausible === "function") {
    window.plausible(eventName, { props: payload });
  }

  if (window.umami?.track) {
    window.umami.track(eventName, payload);
  }

  window.dispatchEvent(
    new CustomEvent("transferai:analytics", {
      detail: { eventName, payload },
    }),
  );
};

export const trackCtaClick = (params: {
  ctaName: string;
  ctaLocation: string;
  destination: string;
}) => {
  trackAnalyticsEvent("cta_click", {
    cta_name: params.ctaName,
    cta_location: params.ctaLocation,
    destination: params.destination,
  });
};
