import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { invokeContentAdmin } from "@/lib/content-admin";

type VideoAdminItem = {
  id: string;
  platform: string;
  slug: string;
  title_fr: string;
  title_en: string;
  summary_fr: string;
  summary_en: string;
  video_url: string;
  thumbnail_url: string | null;
  cta_label_fr: string | null;
  cta_label_en: string | null;
  cta_url: string | null;
  frequency_label_fr: string;
  frequency_label_en: string;
  sort_order: number;
  is_featured: boolean;
  status: string;
  published_at: string;
};

const emptyForm = {
  platform: "tiktok",
  slug: "",
  title_fr: "",
  title_en: "",
  summary_fr: "",
  summary_en: "",
  video_url: "",
  thumbnail_url: "",
  cta_label_fr: "Voir la capsule",
  cta_label_en: "Watch the clip",
  cta_url: "",
  frequency_label_fr: "5 capsules / semaine",
  frequency_label_en: "5 clips / week",
  sort_order: "100",
  is_featured: false,
  status: "draft",
};

const VideoCapsuleAdminPanel = ({ token }: { token: string }) => {
  const [items, setItems] = useState<VideoAdminItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const hydrateForm = (item: VideoAdminItem | null) => {
    if (!item) {
      setForm(emptyForm);
      return;
    }

    setForm({
      platform: item.platform,
      slug: item.slug,
      title_fr: item.title_fr,
      title_en: item.title_en,
      summary_fr: item.summary_fr,
      summary_en: item.summary_en,
      video_url: item.video_url,
      thumbnail_url: item.thumbnail_url ?? "",
      cta_label_fr: item.cta_label_fr ?? "Voir la capsule",
      cta_label_en: item.cta_label_en ?? "Watch the clip",
      cta_url: item.cta_url ?? "",
      frequency_label_fr: item.frequency_label_fr,
      frequency_label_en: item.frequency_label_en,
      sort_order: String(item.sort_order),
      is_featured: item.is_featured,
      status: item.status,
    });
  };

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await invokeContentAdmin<{ data?: VideoAdminItem[] }>(token, {
        entity: "videos",
        action: "list",
      });

      const nextItems = response.data ?? [];
      setItems(nextItems);

      if (selectedId) {
        const nextSelected = nextItems.find((item) => item.id === selectedId) ?? null;
        hydrateForm(nextSelected);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les capsules vidéo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const selectItem = (item: VideoAdminItem | null) => {
    setSelectedId(item?.id ?? null);
    hydrateForm(item);
    setError(null);
    setSuccess(null);
  };

  const save = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      ...(selectedId ? { id: selectedId } : {}),
      ...form,
      sort_order: Number(form.sort_order || "100"),
    };

    try {
      await invokeContentAdmin(token, {
        entity: "videos",
        action: selectedId ? "update" : "create",
        payload,
      });

      setSuccess(selectedId ? "Capsule vidéo mise à jour." : "Capsule vidéo créée.");
      if (!selectedId) {
        setForm(emptyForm);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer la capsule.");
    } finally {
      setIsSaving(false);
    }
  };

  const setStatus = async (id: string, status: string) => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await invokeContentAdmin(token, {
        entity: "videos",
        action: "set-status",
        payload: { id, status },
      });
      setSuccess(`Statut mis à jour : ${status}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de changer le statut.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-heading text-xl font-bold text-card-foreground">Capsules vidéo & réseaux</h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Alimentez ici les vidéos sociales publiées. Le site récupère automatiquement les capsules publiées pour la
              page média, sans dépendre d'un import manuel dans le code.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => selectItem(null)}>
              Nouvelle capsule
            </Button>
            <Button type="button" variant="ghost" onClick={load} disabled={isLoading}>
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            </Button>
          </div>
        </div>
      </div>

      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">{success}</div>}

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-heading text-lg font-bold text-card-foreground">Capsules publiées et brouillons</h3>
            <Badge variant="outline">{items.length} capsule(s)</Badge>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectItem(item)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  selectedId === item.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-card-foreground">{item.title_fr}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.platform} · ordre {item.sort_order} · {new Date(item.published_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.is_featured && <Badge className="bg-primary text-primary-foreground">En avant</Badge>}
                    <Badge variant="secondary">{item.status}</Badge>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setStatus(item.id, "published"); }}>
                    Publier
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setStatus(item.id, "draft"); }}>
                    Brouillon
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setStatus(item.id, "archived"); }}>
                    Archiver
                  </Button>
                </div>
              </button>
            ))}
            {items.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
                Aucune capsule trouvée pour l'instant.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-heading text-lg font-bold text-card-foreground">
            {selectedId ? "Modifier une capsule" : "Créer une capsule"}
          </h3>

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Plateforme
                <Input value={form.platform} onChange={(e) => setForm((current) => ({ ...current, platform: e.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Slug
                <Input value={form.slug} onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Titre FR
                <Input value={form.title_fr} onChange={(e) => setForm((current) => ({ ...current, title_fr: e.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Title EN
                <Input value={form.title_en} onChange={(e) => setForm((current) => ({ ...current, title_en: e.target.value }))} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Résumé FR
                <Textarea rows={4} value={form.summary_fr} onChange={(e) => setForm((current) => ({ ...current, summary_fr: e.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Summary EN
                <Textarea rows={4} value={form.summary_en} onChange={(e) => setForm((current) => ({ ...current, summary_en: e.target.value }))} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                URL vidéo / post
                <Input value={form.video_url} onChange={(e) => setForm((current) => ({ ...current, video_url: e.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                URL miniature
                <Input value={form.thumbnail_url} onChange={(e) => setForm((current) => ({ ...current, thumbnail_url: e.target.value }))} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                CTA FR
                <Input value={form.cta_label_fr} onChange={(e) => setForm((current) => ({ ...current, cta_label_fr: e.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                CTA EN
                <Input value={form.cta_label_en} onChange={(e) => setForm((current) => ({ ...current, cta_label_en: e.target.value }))} />
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium text-card-foreground">
              URL CTA
              <Input value={form.cta_url} onChange={(e) => setForm((current) => ({ ...current, cta_url: e.target.value }))} />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Fréquence FR
                <Input value={form.frequency_label_fr} onChange={(e) => setForm((current) => ({ ...current, frequency_label_fr: e.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Frequency EN
                <Input value={form.frequency_label_en} onChange={(e) => setForm((current) => ({ ...current, frequency_label_en: e.target.value }))} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Ordre
                <Input value={form.sort_order} onChange={(e) => setForm((current) => ({ ...current, sort_order: e.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-medium text-card-foreground">
                Statut
                <Input value={form.status} onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))} />
              </label>
            </div>

            <label className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm font-medium text-card-foreground">
              Capsule mise en avant
              <Switch checked={form.is_featured} onCheckedChange={(checked) => setForm((current) => ({ ...current, is_featured: checked }))} />
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={save} disabled={isSaving || !form.slug || !form.title_fr || !form.video_url}>
                {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                {selectedId ? "Mettre à jour" : "Créer la capsule"}
              </Button>
              {selectedId && (
                <Button type="button" variant="outline" onClick={() => selectItem(null)}>
                  Nouvelle capsule
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCapsuleAdminPanel;
