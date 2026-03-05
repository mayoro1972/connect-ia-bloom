import { useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

interface CalendlyEmbedProps {
  url?: string;
  className?: string;
}

const CalendlyEmbed = ({ url = "https://calendly.com", className = "" }: CalendlyEmbedProps) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="calendly-inline-widget rounded-xl overflow-hidden border border-border"
        data-url={url}
        style={{ minWidth: "320px", height: "630px" }}
      />
    </div>
  );
};

export default CalendlyEmbed;
