import { useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimatedLogoWatermarks from "@/components/AnimatedLogoWatermarks";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabaseUnavailableMessage } from "@/integrations/supabase/client";

const hashPassword = async (value: string) => {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const ProspectAuditLoginPage = () => {
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      toast({
        title: "Connexion indisponible",
        description: supabaseUnavailableMessage,
        variant: "destructive",
      });
      return;
    }

    setIsBusy(true);

    try {
      const passwordHash = await hashPassword(password);
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
      const anonJwt =
        import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

      const response = await fetch(`${supabaseUrl}/functions/v1/prospect-audit-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonJwt,
          Authorization: `Bearer ${anonJwt}`,
        },
        body: JSON.stringify({
          identifier: identifier.trim().toLowerCase(),
          passwordHash,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || typeof result?.accessUrl !== "string") {
        throw new Error(typeof result?.error === "string" ? result.error : "Connexion impossible");
      }

      window.location.assign(result.accessUrl);
    } catch (error) {
      toast({
        title: "Accès refusé",
        description:
          error instanceof Error && error.message === "invalid_credentials"
            ? "Identifiant ou mot de passe incorrect."
            : "Impossible d'ouvrir le formulaire d'audit pour le moment.",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AnimatedLogoWatermarks />
        <Navbar />

        <main className="relative z-10 px-4 py-16 lg:px-8">
          <div className="container mx-auto max-w-2xl">
            <div className="rounded-[30px] border border-border bg-card p-8 shadow-[0_28px_80px_-58px_rgba(16,33,61,0.28)] md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <LockKeyhole size={14} />
                Accès sécurisé au formulaire d'audit
              </div>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-card-foreground md:text-5xl">
                Connectez-vous pour ouvrir votre formulaire
              </h1>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Utilisez l&apos;adresse email et le mot de passe définis lors de votre demande. Nous vous redirigerons ensuite vers votre formulaire d&apos;audit personnalisé.
              </p>

              <form onSubmit={submit} className="mt-8 space-y-5">
                <input
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
                <button
                  type="submit"
                  disabled={isBusy}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-gradient px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? "Connexion en cours..." : "Ouvrir mon formulaire"}
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProspectAuditLoginPage;
