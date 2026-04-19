import { useMemo, useState } from "react";
import { addDays, addMonths, format, isBefore, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { enUS, fr as frLocale } from "date-fns/locale";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, Globe2, Video } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { directLinks } from "@/lib/site-links";
import { trackAnalyticsEvent } from "@/lib/analytics";
import logoTransferAI from "@/assets/logo-transferai-nettelecom.png";

interface AppointmentBookingProps {
  /** URL Calendly cible (ouverte au clic sur "Réserver") */
  calendlyUrl?: string;
  /** Titre de l'événement (ex: "Diagnostic IA gratuit – 30 min") */
  eventTitle?: { fr: string; en: string };
  /** Nom de l'hôte affiché à gauche */
  hostName?: string;
  /** Sous-titre / rôle de l'hôte */
  hostRole?: { fr: string; en: string };
  /** Description courte sous le bloc gauche */
  description?: { fr: string; en: string };
  /** Données prospect à transmettre à Calendly en query string */
  prefill?: {
    name?: string;
    email?: string;
    company?: string;
    domain?: string;
  };
  /** Identifiant analytics (source, location) */
  analyticsLocation?: string;
  className?: string;
}

// Créneaux fixes proposés (l'utilisateur finit la résa sur Calendly)
const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const isWeekend = (date: Date) => {
  const d = date.getDay();
  return d === 0 || d === 6;
};

const buildCalendlyUrl = (baseUrl: string, prefill?: AppointmentBookingProps["prefill"], date?: Date, slot?: string) => {
  try {
    const url = new URL(baseUrl);
    if (prefill?.name) url.searchParams.set("name", prefill.name);
    if (prefill?.email) url.searchParams.set("email", prefill.email);
    const a1: string[] = [];
    if (prefill?.company) a1.push(`Organisation: ${prefill.company}`);
    if (prefill?.domain) a1.push(`Domaine: ${prefill.domain}`);
    if (date && slot) a1.push(`Créneau souhaité: ${format(date, "EEEE d MMMM yyyy", { locale: frLocale })} à ${slot}`);
    if (a1.length) url.searchParams.set("a1", a1.join(" | "));
    return url.toString();
  } catch {
    return baseUrl;
  }
};

const AppointmentBooking = ({
  calendlyUrl = directLinks.calendlyBooking,
  eventTitle = { fr: "Diagnostic IA gratuit – 30 min", en: "Free AI Diagnostic – 30 min" },
  hostName = "Marius Ayoro",
  hostRole = { fr: "Expert IA · TransferAI Africa", en: "AI Expert · TransferAI Africa" },
  description,
  prefill,
  analyticsLocation = "appointment_booking",
  className = "",
}: AppointmentBookingProps) => {
  const { language } = useLanguage();
  const locale = language === "en" ? enUS : frLocale;
  const today = startOfDay(new Date());

  const [viewMonth, setViewMonth] = useState<Date>(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [viewMonth]);

  const weekdayLabels = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => format(addDays(base, i), "EEEEEE", { locale }));
  }, [locale]);

  const t = {
    fr: {
      defaultDescription:
        "Un échange de 30 minutes pour comprendre votre besoin, identifier les bons cas d'usage IA et orienter la suite (catalogue, audit ou solution sur-mesure).",
      videoConf: "Visio (Google Meet) – lien envoyé après confirmation",
      duration: "30 min",
      pickDate: "Choisissez une date",
      pickSlot: "Créneaux disponibles",
      pickSlotEmpty: "Sélectionnez d'abord un jour dans le calendrier.",
      timezone: "Fuseau",
      prev: "Précédent",
      next: "Suivant",
      reserve: "Réserver ce créneau",
      reserveNoSlot: "Sélectionnez un créneau",
      free: "Gratuit",
      poweredBy: "Confirmation via Calendly",
      summary: "Récapitulatif",
      noSlotYet: "Aucune date sélectionnée",
    },
    en: {
      defaultDescription:
        "A 30-minute call to understand your need, surface the right AI use cases and orient the next step (catalogue, audit or custom solution).",
      videoConf: "Video call (Google Meet) – link sent after confirmation",
      duration: "30 min",
      pickDate: "Pick a date",
      pickSlot: "Available slots",
      pickSlotEmpty: "Pick a day on the calendar first.",
      timezone: "Timezone",
      prev: "Previous",
      next: "Next",
      reserve: "Book this slot",
      reserveNoSlot: "Pick a slot",
      free: "Free",
      poweredBy: "Confirmation via Calendly",
      summary: "Summary",
      noSlotYet: "No date selected yet",
    },
  }[language];

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today) || isWeekend(date) || !isSameMonth(date, viewMonth)) return;
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleReserve = () => {
    if (!selectedDate || !selectedSlot) return;
    const url = buildCalendlyUrl(calendlyUrl, prefill, selectedDate, selectedSlot);
    trackAnalyticsEvent("appointment_booking_started", {
      location: analyticsLocation,
      slot: selectedSlot,
      date: format(selectedDate, "yyyy-MM-dd"),
      domain: prefill?.domain,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_24px_90px_-50px_rgba(15,23,42,0.4)] ${className}`}
    >
      <div className="grid lg:grid-cols-[1fr_1.35fr]">
        {/* COLONNE GAUCHE — Infos */}
        <div className="relative border-b border-border bg-gradient-to-br from-primary/5 via-background to-background p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <img src={logoTransferAI} alt="TransferAI Africa" className="h-10 w-auto" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">TransferAI Africa</p>
              <p className="text-xs text-muted-foreground">{hostRole[language]}</p>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {t.free}
          </div>

          <h3 className="mt-3 font-heading text-2xl font-bold leading-tight text-card-foreground md:text-3xl">
            {eventTitle[language]}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {description?.[language] ?? t.defaultDescription}
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-start gap-3 text-muted-foreground">
              <Clock3 size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>{t.duration}</span>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Video size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>{t.videoConf}</span>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Globe2 size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>
                {t.timezone} : {tz}
              </span>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <CalendarDays size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>
                {selectedDate
                  ? `${format(selectedDate, "EEEE d MMMM yyyy", { locale })}${selectedSlot ? ` · ${selectedSlot}` : ""}`
                  : t.noSlotYet}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-background/70 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-card-foreground">{hostName}</p>
            <p className="mt-1">{t.poweredBy}</p>
          </div>
        </div>

        {/* COLONNE DROITE — Calendrier + créneaux */}
        <div className="p-6 md:p-8">
          {/* En-tête mois */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{t.pickDate}</p>
              <p className="mt-1 font-heading text-lg font-bold text-card-foreground">
                {format(viewMonth, "MMMM yyyy", { locale })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const prev = addMonths(viewMonth, -1);
                  if (!isBefore(startOfMonth(prev), startOfMonth(today))) setViewMonth(prev);
                }}
                disabled={isSameMonth(viewMonth, today)}
                aria-label={t.prev}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                aria-label={t.next}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Grille calendrier */}
          <div className="mt-5 grid grid-cols-7 gap-1 text-center">
            {weekdayLabels.map((label) => (
              <div key={label} className="py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
              </div>
            ))}
            {calendarDays.map((day) => {
              const inMonth = isSameMonth(day, viewMonth);
              const isPast = isBefore(day, today);
              const disabled = !inMonth || isPast || isWeekend(day);
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const isToday = isSameDay(day, today);

              return (
                <button
                  type="button"
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  disabled={disabled}
                  className={[
                    "aspect-square rounded-full text-sm font-medium transition",
                    !inMonth ? "text-muted-foreground/30" : "",
                    disabled
                      ? "cursor-not-allowed text-muted-foreground/40"
                      : "text-card-foreground hover:bg-primary/10 hover:text-primary",
                    isSelected ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "",
                    !isSelected && isToday ? "ring-1 ring-primary/40" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Créneaux */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{t.pickSlot}</p>
            {selectedDate ? (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {TIME_SLOTS.map((slot) => {
                  const isActive = selectedSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={[
                        "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-card-foreground hover:border-primary/50 hover:text-primary",
                      ].join(" ")}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-border bg-background/60 px-4 py-6 text-center text-sm text-muted-foreground">
                {t.pickSlotEmpty}
              </p>
            )}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleReserve}
            disabled={!selectedDate || !selectedSlot}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={16} />
            {selectedDate && selectedSlot ? t.reserve : t.reserveNoSlot}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
