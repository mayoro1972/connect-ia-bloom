import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/integrations/supabase/client";

type ReviewIssue = {
  id: string;
  title: string;
  subject: string;
  status: string;
  issue_date: string;
  scheduled_for: string | null;
};

type ReviewResponse = {
  data?: { issue: ReviewIssue; action: "approve" | "reject"; actionable?: boolean; done?: boolean };
  error?: string;
};

const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  review: "En relecture",
  approved: "Approuvée",
  scheduled: "Programmée",
  sending: "En cours d'envoi",
  sent: "Envoyée",
  archived: "Rejetée / archivée",
};

const formatDate = (value: string | null, withTime = false) =>
  value
    ? new Intl.DateTimeFormat("fr-CI", {
        day: "numeric",
        month: "long",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
        timeZone: "Africa/Abidjan",
      }).format(new Date(withTime ? value : `${value}T12:00:00Z`))
    : "—";

const callReview = async (params: Record<string, string>, step: "inspect" | "confirm"): Promise<ReviewResponse> => {
  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/functions/v1/newsletter-review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ ...params, step }),
    });
  } catch {
    return { error: "Service de validation injoignable. Réessayez ou utilisez le back-office." };
  }
  const payload = (await response.json().catch(() => ({}))) as ReviewResponse;
  if (!response.ok && !payload.error) payload.error = "La validation a échoué.";
  return payload;
};

const NewsletterValidation = () => {
  const [searchParams] = useSearchParams();
  const params = {
    issue: searchParams.get("issue") ?? "",
    action: searchParams.get("action") ?? "",
    exp: searchParams.get("exp") ?? "",
    sig: searchParams.get("sig") ?? "",
  };
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [isBusy, setIsBusy] = useState(true);

  useEffect(() => {
    callReview(params, "inspect").then((payload) => {
      setResult(payload);
      setIsBusy(false);
    });
    // Les paramètres du lien ne changent pas pendant la visite.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirm = async () => {
    setIsBusy(true);
    setResult(await callReview(params, "confirm"));
    setIsBusy(false);
  };

  const issue = result?.data?.issue;
  const isApprove = params.action === "approve";
  const editUrl = issue ? `/back-office/newsletters?issue=${issue.id}&mode=email` : "/back-office/newsletters";

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-xl border bg-background p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">TransferAI — Validation newsletter</p>
        <h1 className="mt-3 text-2xl font-semibold">{isApprove ? "Approuver cette édition ?" : "Rejeter cette édition ?"}</h1>

        {isBusy && !result && <p className="mt-6 text-muted-foreground">Vérification du lien…</p>}

        {issue && (
          <dl className="mt-6 space-y-2 rounded-lg bg-muted/60 p-4 text-sm">
            <div><dt className="inline font-medium">Titre : </dt><dd className="inline">{issue.title}</dd></div>
            <div><dt className="inline font-medium">Objet : </dt><dd className="inline">{issue.subject}</dd></div>
            <div><dt className="inline font-medium">Édition du : </dt><dd className="inline">{formatDate(issue.issue_date)}</dd></div>
            <div><dt className="inline font-medium">Statut : </dt><dd className="inline">{statusLabels[issue.status] ?? issue.status}</dd></div>
          </dl>
        )}

        {result?.error && <p className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{result.error}</p>}

        {result?.data?.done && (
          <p className="mt-6 rounded-lg border border-green-600/30 bg-green-600/10 p-4 text-sm">
            {isApprove
              ? `Édition approuvée. Elle partira aux abonnés au prochain passage de l'envoi automatique (vendredi 08:30, heure d'Abidjan)${issue?.scheduled_for ? `, pas avant le ${formatDate(issue.scheduled_for, true)}` : ""}.`
              : "Édition rejetée : elle est archivée et ne sera pas envoyée."}
          </p>
        )}

        {result?.data && !result.data.done && result.data.actionable && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={confirm} disabled={isBusy} variant={isApprove ? "default" : "destructive"}>
              {isApprove ? "Confirmer l'approbation" : "Confirmer le rejet"}
            </Button>
            <Button asChild variant="outline"><Link to={editUrl}>Modifier d'abord</Link></Button>
          </div>
        )}

        {result?.data && !result.data.done && !result.data.actionable && (
          <p className="mt-6 text-sm text-muted-foreground">Cette édition n'est plus en brouillon : aucune action possible depuis ce lien.</p>
        )}

        <p className="mt-8 text-xs text-muted-foreground">
          Besoin d'aller plus loin ? <Link className="underline" to={editUrl}>Ouvrir le back-office</Link>.
        </p>
      </div>
    </main>
  );
};

export default NewsletterValidation;
