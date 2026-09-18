import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/integrations/supabase/client";

type UnsubscribeResponse = {
  data?: { email: string; unsubscribed: boolean };
  error?: string;
};

const callUnsubscribe = async (params: { e: string; t: string }, step: "inspect" | "confirm"): Promise<UnsubscribeResponse> => {
  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/functions/v1/newsletter-unsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ ...params, step }),
    });
  } catch {
    return { error: "Service injoignable. Réessayez dans quelques instants ou écrivez à contact@transferai.ci." };
  }
  const payload = (await response.json().catch(() => ({}))) as UnsubscribeResponse;
  if (!response.ok && !payload.error) payload.error = "Le désabonnement a échoué.";
  return payload;
};

const NewsletterUnsubscribe = () => {
  const [searchParams] = useSearchParams();
  const params = { e: searchParams.get("e") ?? "", t: searchParams.get("t") ?? "" };
  const [result, setResult] = useState<UnsubscribeResponse | null>(null);
  const [isBusy, setIsBusy] = useState(true);

  useEffect(() => {
    callUnsubscribe(params, "inspect").then((payload) => {
      setResult(payload);
      setIsBusy(false);
    });
    // Les paramètres du lien ne changent pas pendant la visite.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirm = async () => {
    setIsBusy(true);
    setResult(await callUnsubscribe(params, "confirm"));
    setIsBusy(false);
  };

  const email = result?.data?.email;
  const done = result?.data?.unsubscribed === true;

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-xl border bg-background p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">TransferAI — Newsletter</p>
        <h1 className="mt-3 text-2xl font-semibold">{done ? "Vous êtes désabonné" : "Se désabonner de la newsletter"}</h1>

        {isBusy && !result && <p className="mt-6 text-muted-foreground">Vérification du lien…</p>}

        {result?.error && <p className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{result.error}</p>}

        {email && !done && (
          <>
            <p className="mt-6 text-sm leading-6">
              Vous ne recevrez plus « TransferAI — Le Journal » à l’adresse <strong>{email}</strong>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={confirm} disabled={isBusy}>Confirmer le désabonnement</Button>
              <Button asChild variant="outline"><Link to="/">Rester abonné</Link></Button>
            </div>
          </>
        )}

        {done && (
          <p className="mt-6 rounded-lg border border-green-600/30 bg-green-600/10 p-4 text-sm leading-6">
            L’adresse <strong>{email}</strong> ne recevra plus la newsletter. Vous pouvez vous réinscrire à tout moment depuis le blog TransferAI.
          </p>
        )}

        <p className="mt-8 text-xs text-muted-foreground">
          Une question ? Écrivez à <a className="underline" href="mailto:contact@transferai.ci">contact@transferai.ci</a>.
        </p>
      </div>
    </main>
  );
};

export default NewsletterUnsubscribe;
