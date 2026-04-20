import { useState } from "react";
import { Loader2, RefreshCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { invokeContentAdmin } from "@/lib/content-admin";

type SyncResult = {
  feed: string;
  fetched: number;
  inserted_signals: number;
  inserted_posts: number;
  skipped: number;
  used_fallback: boolean;
  error: string | null;
};

type SyncResponse = {
  data?: {
    results: SyncResult[];
    total_inserted_posts: number;
    total_inserted_signals: number;
  };
  error?: string;
};

const VendorFeedsAdminPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResults, setLastResults] = useState<SyncResult[] | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const runSync = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSummary("");

    try {
      const response = (await invokeContentAdmin("ai-vendor-feeds-sync", {
        per_feed_limit: 6,
      })) as SyncResponse;

      if (response.error) {
        setErrorMessage(response.error);
        setIsLoading(false);
        return;
      }

      const results = response.data?.results ?? [];
      setLastResults(results);
      const totalPosts = response.data?.total_inserted_posts ?? 0;
      const totalSignals = response.data?.total_inserted_signals ?? 0;
      setSummary(
        `${totalPosts} nouvelle(s) carte(s) publiée(s) — ${totalSignals} signal(aux) ajouté(s).`,
      );
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Veille IA — sources officielles
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Synchronisation automatique des annonces OpenAI, Anthropic (Claude) et Google AI (Gemini).
            Les nouveautés sont traduites FR/EN par l'IA puis publiées dans la rubrique
            <strong> Médias, veille &amp; opportunités IA</strong>. Cron : 4× / jour.
          </p>
        </div>
        <button
          type="button"
          onClick={runSync}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCcw className="size-4" />
          )}
          Rafraîchir maintenant
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { name: "OpenAI", url: "openai.com/news" },
          { name: "Anthropic (Claude)", url: "anthropic.com/news" },
          { name: "Google AI / Gemini", url: "research.google/blog" },
        ].map((source) => (
          <div
            key={source.name}
            className="rounded-xl border border-border/50 bg-background/60 p-4"
          >
            <div className="text-sm font-semibold text-foreground">{source.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{source.url}</div>
          </div>
        ))}
      </div>

      {summary && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
          {summary}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {lastResults && lastResults.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-foreground">Détails par source</div>
          <div className="overflow-hidden rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Récupérés</th>
                  <th className="px-3 py-2">Nouveaux signaux</th>
                  <th className="px-3 py-2">Cartes publiées</th>
                  <th className="px-3 py-2">Doublons ignorés</th>
                  <th className="px-3 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {lastResults.map((result) => (
                  <tr key={result.feed} className="border-t border-border/40">
                    <td className="px-3 py-2 font-medium text-foreground">{result.feed}</td>
                    <td className="px-3 py-2 text-muted-foreground">{result.fetched}</td>
                    <td className="px-3 py-2 text-muted-foreground">{result.inserted_signals}</td>
                    <td className="px-3 py-2 text-muted-foreground">{result.inserted_posts}</td>
                    <td className="px-3 py-2 text-muted-foreground">{result.skipped}</td>
                    <td className="px-3 py-2">
                      {result.error ? (
                        <Badge variant="destructive" className="text-xs">
                          {result.error.slice(0, 40)}
                        </Badge>
                      ) : result.used_fallback ? (
                        <Badge variant="secondary" className="text-xs">Firecrawl fallback</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-primary/15 text-primary">
                          OK
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorFeedsAdminPanel;
