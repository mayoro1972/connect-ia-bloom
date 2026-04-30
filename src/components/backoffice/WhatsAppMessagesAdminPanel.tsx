import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, MessageCircle, RefreshCw, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { invokeContentAdmin } from "@/lib/content-admin";

type WhatsAppMessageItem = {
  id: string;
  created_at: string;
  message_sid: string;
  account_sid: string | null;
  from_number: string;
  to_number: string | null;
  profile_name: string | null;
  body: string | null;
  num_media: number;
  message_status: string | null;
  wa_id: string | null;
  raw_payload: Record<string, unknown>;
  is_read?: boolean;
  status?: string;
  category?: string | null;
  internal_notes?: string | null;
  handled_at?: string | null;
  last_action_at?: string | null;
};

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

const statusOptions = [
  { value: "new", label: "Nouveau" },
  { value: "to_process", label: "À traiter" },
  { value: "in_progress", label: "En cours" },
  { value: "answered", label: "Répondu" },
  { value: "closed", label: "Clos" },
  { value: "spam", label: "Spam" },
];

const categoryOptions = [
  { value: "", label: "Non classée" },
  { value: "general", label: "Renseignement général" },
  { value: "audit_ia", label: "Audit IA" },
  { value: "formation", label: "Formation" },
  { value: "catalogue", label: "Catalogue" },
  { value: "partenariat", label: "Partenariat" },
  { value: "support", label: "Support" },
  { value: "other", label: "Autre" },
];

const statusTone: Record<string, string> = {
  new: "bg-primary text-primary-foreground",
  to_process: "bg-amber-500 text-white",
  in_progress: "bg-sky-600 text-white",
  answered: "bg-emerald-600 text-white",
  closed: "bg-secondary text-secondary-foreground",
  spam: "bg-destructive text-destructive-foreground",
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const cleanWhatsappNumber = (value: string) => value.replace(/^whatsapp:/i, "").replace(/[^\d+]/g, "");

const buildReplyHref = (fromNumber: string) => {
  const cleanNumber = cleanWhatsappNumber(fromNumber).replace(/^\+/, "");
  const replyMessage =
    "Bonjour, nous avons bien reçu votre message. Merci. Notre équipe revient vers vous très rapidement.";

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(replyMessage)}`;
};

const excerpt = (value: string | null, maxLength = 96) => {
  const source = (value ?? "").trim();
  if (source.length <= maxLength) return source || "Sans contenu";
  return `${source.slice(0, maxLength).trim()}…`;
};

const WhatsAppMessagesAdminPanel = ({ token }: { token: string }) => {
  const [items, setItems] = useState<WhatsAppMessageItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("new");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      if (statusFilter !== "all" && (item.status ?? "new") !== statusFilter) return false;
      if (categoryFilter !== "all" && (item.category ?? "") !== categoryFilter) return false;
      if (showUnreadOnly && item.is_read) return false;

      if (!term) return true;

      const haystack = [
        item.profile_name ?? "",
        item.from_number,
        item.body ?? "",
        item.category ?? "",
        item.status ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [items, searchTerm, statusFilter, categoryFilter, showUnreadOnly]);

  const overview = useMemo(() => {
    const total = items.length;
    const unread = items.filter((item) => !item.is_read).length;
    const toProcess = items.filter((item) => ["new", "to_process"].includes(item.status ?? "new")).length;
    const audit = items.filter((item) => item.category === "audit_ia").length;

    return { total, unread, toProcess, audit };
  }, [items]);

  const syncForm = (item: WhatsAppMessageItem | null) => {
    setStatus(item?.status ?? "new");
    setCategory(item?.category ?? "");
    setNotes(item?.internal_notes ?? "");
  };

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await invokeContentAdmin<{ data?: WhatsAppMessageItem[] }>(token, {
        entity: "whatsapp-messages",
        action: "list",
      });

      const nextItems = response.data ?? [];
      setItems(nextItems);

      const nextSelected =
        nextItems.find((item) => item.id === selectedId) ??
        nextItems[0] ??
        null;

      setSelectedId(nextSelected?.id ?? null);
      syncForm(nextSelected);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les messages WhatsApp.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  useEffect(() => {
    syncForm(selectedItem);
  }, [selectedItem]);

  const selectItem = async (item: WhatsAppMessageItem) => {
    setSelectedId(item.id);
    syncForm(item);
    setError(null);
    setSuccess(null);

    if (!item.is_read) {
      try {
        await invokeContentAdmin(token, {
          entity: "whatsapp-messages",
          action: "mark-read",
          payload: { id: item.id },
        });

        setItems((current) =>
          current.map((entry) => (entry.id === item.id ? { ...entry, is_read: true } : entry)),
        );
      } catch {
        // Silent fail: do not block selection if mark-read fails.
      }
    }
  };

  const save = async () => {
    if (!selectedItem) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await invokeContentAdmin<{ data?: WhatsAppMessageItem }>(token, {
        entity: "whatsapp-messages",
        action: "update",
        payload: {
          id: selectedItem.id,
          status,
          category,
          internal_notes: notes,
          is_read: true,
        },
      });

      const nextItem = response.data ?? {
        ...selectedItem,
        status,
        category: category || null,
        internal_notes: notes || null,
        is_read: true,
      };

      setItems((current) => current.map((item) => (item.id === nextItem.id ? nextItem : item)));
      setSuccess("Message WhatsApp mis à jour.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer les changements.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-heading text-xl font-bold text-card-foreground">Messages WhatsApp</h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Suivez ici les demandes entrantes WhatsApp, classez-les rapidement et basculez vers une réponse manuelle
              sur WhatsApp sans quitter le flux opérationnel TransferAI.
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={load} disabled={isLoading}>
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Messages</p>
            <p className="mt-2 font-heading text-2xl font-bold text-card-foreground">{overview.total}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Non lus</p>
            <p className="mt-2 font-heading text-2xl font-bold text-card-foreground">{overview.unread}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">À traiter</p>
            <p className="mt-2 font-heading text-2xl font-bold text-card-foreground">{overview.toProcess}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Audit IA</p>
            <p className="mt-2 font-heading text-2xl font-bold text-card-foreground">{overview.audit}</p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">{success}</div>}

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-heading text-lg font-bold text-card-foreground">Liste + filtres</h3>
            <Badge variant="outline">{filteredItems.length} résultat(s)</Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Rechercher nom, numéro ou message"
            />

            <label className="flex items-center gap-3 rounded-lg border border-border px-4 py-2.5 text-sm text-card-foreground">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(event) => setShowUnreadOnly(event.target.checked)}
                className="size-4 rounded border-border"
              />
              Uniquement les non lus
            </label>

            <select className={fieldClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">Tous les statuts</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select className={fieldClass} value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">Toutes les catégories</option>
              {categoryOptions
                .filter((option) => option.value)
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>

          <div className="mt-5 space-y-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectItem(item)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  selectedId === item.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-card-foreground">
                        {item.profile_name?.trim() || cleanWhatsappNumber(item.from_number)}
                      </p>
                      {!item.is_read && <Badge className="bg-primary text-primary-foreground">Nouveau</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cleanWhatsappNumber(item.from_number)} · {formatDateTime(item.created_at)}
                    </p>
                  </div>

                  <Badge className={statusTone[item.status ?? "new"] ?? statusTone.new}>
                    {statusOptions.find((option) => option.value === (item.status ?? "new"))?.label ?? "Nouveau"}
                  </Badge>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{excerpt(item.body)}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.category ? (
                    <Badge variant="outline">
                      {categoryOptions.find((option) => option.value === item.category)?.label ?? item.category}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Non classée</Badge>
                  )}

                  <Badge variant="outline">{item.num_media} média</Badge>
                </div>
              </button>
            ))}

            {filteredItems.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
                Aucun message ne correspond aux filtres actuels.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-heading text-lg font-bold text-card-foreground">Fiche détail + actions</h3>

          {!selectedItem ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
              Sélectionnez un message pour voir le détail et le traiter.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-primary" />
                  <p className="font-heading text-xl font-bold text-card-foreground">
                    {selectedItem.profile_name?.trim() || cleanWhatsappNumber(selectedItem.from_number)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {cleanWhatsappNumber(selectedItem.from_number)} · reçu le {formatDateTime(selectedItem.created_at)}
                </p>
                <p className="text-xs text-muted-foreground">SID message : {selectedItem.message_sid}</p>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
                  {(selectedItem.body ?? "").trim() || "Aucun contenu transmis."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-card-foreground">
                  Statut
                  <select className={fieldClass} value={status} onChange={(event) => setStatus(event.target.value)}>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-card-foreground">
                  Catégorie
                  <select className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)}>
                    {categoryOptions.map((option) => (
                      <option key={option.value || "none"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Note interne
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={6}
                  placeholder="Résumé du besoin, suite donnée, contact à rappeler..."
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <Button type="button" onClick={save} disabled={isSaving}>
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Enregistrer
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open(buildReplyHref(selectedItem.from_number), "_blank", "noopener,noreferrer")}
                >
                  <ExternalLink className="size-4" />
                  Répondre sur WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMessagesAdminPanel;
