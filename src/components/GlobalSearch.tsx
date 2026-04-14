import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Compass,
  FileText,
  Newspaper,
  Search,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLanguage } from "@/i18n/LanguageContext";
import { buildSiteSearchIndex, type SearchEntry, type SearchEntryKind } from "@/data/site-search-index";

const copyByLanguage = {
  fr: {
    trigger: "Rechercher",
    triggerPlaceholder: "Formation, catalogue, service...",
    placeholder: "Rechercher une formation, un catalogue, un service ou un article...",
    empty: "Aucun résultat. Essayez un domaine, une formation, un service ou un mot-clé.",
    quickAccess: "Accès rapides",
    resultsCount: (count: number) => `${count} résultat${count > 1 ? "s" : ""}`,
    typeLabels: {
      action: "Action",
      page: "Page",
      catalogue: "Catalogue",
      formation: "Formation",
      resource: "Ressource",
    },
    groups: {
      action: "Actions rapides",
      page: "Pages clés",
      catalogue: "Catalogues domaine",
      formation: "Formations",
      resource: "Ressources",
    },
  },
  en: {
    trigger: "Search",
    triggerPlaceholder: "Training, catalogue, service...",
    placeholder: "Search for training, a catalogue, a service, or an article...",
    empty: "No results. Try a domain, training title, service, or keyword.",
    quickAccess: "Quick access",
    resultsCount: (count: number) => `${count} result${count > 1 ? "s" : ""}`,
    typeLabels: {
      action: "Action",
      page: "Page",
      catalogue: "Catalogue",
      formation: "Training",
      resource: "Resource",
    },
    groups: {
      action: "Quick actions",
      page: "Key pages",
      catalogue: "Domain catalogues",
      formation: "Training",
      resource: "Resources",
    },
  },
} as const;

const kindIcons: Record<SearchEntryKind, typeof Sparkles> = {
  action: Sparkles,
  page: Compass,
  catalogue: FileText,
  formation: BookOpen,
  resource: Newspaper,
};

const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getSearchScore = (entry: SearchEntry, rawQuery: string) => {
  if (!rawQuery.trim()) {
    return entry.priority;
  }

  const query = normalizeSearchText(rawQuery);
  const title = normalizeSearchText(entry.title);
  const description = normalizeSearchText(entry.description);
  const keywords = entry.keywords.map(normalizeSearchText).join(" ");
  const haystack = `${title} ${description} ${keywords}`;

  if (!haystack.includes(query)) {
    return -1;
  }

  let score = entry.priority;

  if (title === query) score += 140;
  else if (title.startsWith(query)) score += 110;
  else if (title.includes(query)) score += 80;

  if (keywords.includes(query)) score += 45;
  if (description.includes(query)) score += 20;

  return score;
};

const groupOrder: SearchEntryKind[] = ["action", "page", "catalogue", "formation", "resource"];

const GlobalSearch = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language === "en" ? "en" : "fr";
  const copy = copyByLanguage[lang];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const entries = buildSiteSearchIndex(lang);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const filteredEntries = useMemo(() => {
    const scored = entries
      .map((entry) => ({ entry, score: getSearchScore(entry, query) }))
      .filter((item) => item.score >= 0)
      .sort((left, right) => right.score - left.score);

    if (!query.trim()) {
      return scored.filter((item) => {
        if (item.entry.kind === "formation") {
          return false;
        }

        if (item.entry.kind === "catalogue") {
          return item.score >= 82;
        }

        if (item.entry.kind === "resource") {
          return item.entry.priority >= 78;
        }

        return true;
      });
    }

    return scored.slice(0, 24);
  }, [entries, query]);

  const groupedEntries = groupOrder
    .map((kind) => ({
      kind,
      entries: filteredEntries.filter((item) => item.entry.kind === kind).map((item) => item.entry),
    }))
    .filter((group) => group.entries.length > 0);

  const handleSelect = (href: string) => {
    setOpen(false);

    if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) {
      window.open(href, href.startsWith("http") ? "_blank" : "_self", "noopener,noreferrer");
      return;
    }

    navigate(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-10 min-w-[136px] items-center gap-2 rounded-full border border-stone-200 bg-white px-3 text-left shadow-sm transition-colors hover:border-stone-300 md:flex xl:min-w-[190px] 2xl:min-w-[230px]"
        aria-label={copy.trigger}
      >
        <Search size={16} className="text-slate-400" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-slate-900">{copy.trigger}</div>
          <div className="hidden truncate text-[11px] text-slate-500 2xl:block">{copy.triggerPlaceholder}</div>
        </div>
        <span className="hidden rounded-full border border-stone-200 px-2 py-1 text-[10px] font-heading font-bold uppercase tracking-[0.14em] text-slate-500 2xl:inline-flex">
          ⌘K
        </span>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-slate-800 shadow-sm transition-colors hover:border-stone-300 md:hidden"
        aria-label={copy.trigger}
      >
        <Search size={18} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl overflow-hidden border border-stone-200 p-0 shadow-[0_30px_120px_-48px_rgba(15,23,42,0.55)]">
          <Command className="bg-white" shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={copy.placeholder}
              className="text-base"
            />
            <CommandList className="max-h-[70vh]">
              <div className="border-b border-stone-100 px-4 py-3 text-xs font-medium text-slate-500">
                {query.trim() ? copy.resultsCount(filteredEntries.length) : copy.quickAccess}
              </div>
              <CommandEmpty>{copy.empty}</CommandEmpty>
              {groupedEntries.map((group) => (
                <CommandGroup key={group.kind} heading={copy.groups[group.kind]}>
                  {group.entries.map((entry) => {
                    const Icon = kindIcons[entry.kind];

                    return (
                      <CommandItem
                        key={entry.id}
                        value={`${entry.title} ${entry.description} ${entry.keywords.join(" ")}`}
                        onSelect={() => handleSelect(entry.href)}
                        className="items-start gap-3 rounded-2xl px-3 py-3 data-[selected=true]:bg-stone-50"
                      >
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[hsl(20_92%_96%)] text-[hsl(20_92%_42%)]">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-slate-950">{entry.title}</span>
                            <span className="rounded-full border border-stone-200 px-2 py-0.5 text-[10px] font-heading font-bold uppercase tracking-[0.14em] text-slate-500">
                              {copy.typeLabels[entry.kind]}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{entry.description}</p>
                        </div>
                        <ArrowUpRight size={16} className="mt-1 shrink-0 text-slate-400" />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalSearch;
