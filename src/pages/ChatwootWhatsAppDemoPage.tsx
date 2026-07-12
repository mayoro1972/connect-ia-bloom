import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackAnalyticsEvent } from "@/lib/analytics";

const WEBSITE_TOKEN = "jxg8s1vcYj924dc86yg4j7ou";
const CHATWOOT_BASE_URL = "https://app.chatwoot.com";
const CHATWOOT_DASHBOARD_URL = "https://app.chatwoot.com/app/accounts/163278/dashboard";

declare global {
  interface Window {
    chatwootSDK?: { run: (config: { websiteToken: string; baseUrl: string }) => void };
    $chatwoot?: { toggle: (state?: "open" | "close") => void };
  }
}

type ScriptStep = {
  label: string;
  message: string;
  whatToPoint: string;
};

const scriptSteps: ScriptStep[] = [
  {
    label: "1 — Premier contact",
    message: "Bonjour, je m'appelle Aïcha, je suis responsable RH chez Ivorio Logistics.",
    whatToPoint:
      "L'IA accueille, reformule le besoin, ne pose jamais une question déjà répondue même si l'échange continue.",
  },
  {
    label: "2 — Qualification",
    message: "On a une équipe de 40 personnes, on cherche à automatiser notre support client interne.",
    whatToPoint:
      "Derrière le message affiché, l'IA remplit déjà en silence : entreprise, secteur, besoin, intention — visibles ensuite dans Chatwoot en 'attributs personnalisés'.",
  },
  {
    label: "3 — Escalade en direct (le moment fort)",
    message:
      "C'est assez urgent et stratégique pour nous, je préférerais parler directement à quelqu'un de votre équipe cette semaine.",
    whatToPoint:
      "Basculez sur l'onglet Chatwoot (deuxième écran) : la conversation est assignée à un agent, un email de notification part vers l'équipe, une note privée résume tout le contexte — sans qu'aucun humain n'ait eu à trier le message.",
  },
];

const ChatwootWhatsAppDemoPage = () => {
  const [copied, setCopied] = useState<number | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);

  useEffect(() => {
    trackAnalyticsEvent("chatwoot_whatsapp_demo_view", {});

    if (document.getElementById("chatwoot-demo-sdk")) {
      setWidgetReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "chatwoot-demo-sdk";
    script.src = `${CHATWOOT_BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.onload = () => {
      window.chatwootSDK?.run({ websiteToken: WEBSITE_TOKEN, baseUrl: CHATWOOT_BASE_URL });
      setWidgetReady(true);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!widgetReady) return;
    const onReady = () => window.$chatwoot?.toggle("open");
    window.addEventListener("chatwoot:ready", onReady);
    const fallback = setTimeout(() => window.$chatwoot?.toggle("open"), 1500);
    return () => {
      window.removeEventListener("chatwoot:ready", onReady);
      clearTimeout(fallback);
    };
  }, [widgetReady]);

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text).catch(() => undefined);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B1626] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Retour au site
        </Link>

        {/* Bandeau */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gradient-to-b from-[#10263F] to-[#0B1626] px-7 py-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Agent IA WhatsApp 24/7</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#25D366]">Chatwoot · TransferAI Africa</div>
            </div>
          </div>
          <div className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-wider text-slate-300">
            Démo live — Webinaire 18 juillet
          </div>
        </div>

        <div className="mb-2 inline-flex items-center gap-2 rounded-sm border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#25D366]">
          <Bot className="h-3 w-3" /> Présentée par Emmanuelle Koffi
        </div>
        <h1 className="mb-3 max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl">
          Écrivez dans la bulle de chat, regardez l'IA qualifier et escalader en direct
        </h1>
        <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-slate-300">
          Cette page charge le vrai widget Chatwoot connecté au workflow n8n de production. Chaque message envoyé
          déclenche une vraie exécution&nbsp;: réponse générée par IA, qualification automatique du lead, puis
          escalade humaine (assignation + email + note privée) si le message le justifie.
        </p>
        <p className="mb-10 max-w-2xl rounded border border-[#B3261E]/30 bg-[#B3261E]/10 p-3 text-[12px] font-medium text-[#FCA5A5]">
          ⚠ Conversation réelle dans le Chatwoot de production. Un email d'escalade réel peut partir vers
          contact@transferai.ci si l'étape 3 du script ci-dessous est jouée. Prévenir l'équipe avant la répétition.
        </p>

        {/* Script de démo */}
        <div className="mb-10 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-white">
            <Sparkles className="h-4 w-4 text-[#25D366]" /> Script suggéré pour Emmanuelle
          </h2>
          <p className="mb-5 text-xs text-slate-400">
            3 messages à copier-coller dans la bulle de chat (en bas à droite), dans l'ordre — chacun illustre une
            étape du workflow.
          </p>
          <div className="space-y-4">
            {scriptSteps.map((step, index) => (
              <div key={step.label} className="rounded border border-white/10 bg-[#0B1626] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[#25D366]">
                    {step.label}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 border-white/20 bg-transparent px-2 text-[11px] text-slate-200 hover:bg-white/10"
                    onClick={() => copyMessage(step.message, index)}
                  >
                    {copied === index ? (
                      <CheckCircle2 className="mr-1 h-3 w-3 text-[#25D366]" />
                    ) : (
                      <Copy className="mr-1 h-3 w-3" />
                    )}
                    {copied === index ? "Copié" : "Copier"}
                  </Button>
                </div>
                <p className="mb-2 text-sm italic text-slate-100">"{step.message}"</p>
                <p className="flex items-start gap-1.5 text-xs text-slate-400">
                  <UserCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" /> {step.whatToPoint}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Coulisses */}
        <div className="mb-10 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
            <ShieldAlert className="h-4 w-4 text-amber-400" /> Pour montrer les coulisses en direct
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-300">
            <li>
              Ouvrir un deuxième onglet sur le tableau de bord Chatwoot avant de commencer :{" "}
              <a
                href={CHATWOOT_DASHBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#25D366] underline underline-offset-2"
              >
                app.chatwoot.com <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Envoyer le message 1 ici, puis montrer la conversation qui apparaît côté Chatwoot.</li>
            <li>Envoyer le message 2 : ouvrir la conversation côté Chatwoot, montrer les attributs personnalisés qui se remplissent (entreprise, secteur, intention).</li>
            <li>
              Envoyer le message 3 : montrer en direct l'assignation à un agent, le label ajouté, et la note privée
              interne générée automatiquement — c'est le moment le plus parlant pour l'audience.
            </li>
          </ol>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 py-8 text-sm text-slate-400">
          {widgetReady ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-[#25D366]" /> Le widget de chat est chargé — bulle verte en bas à
              droite.
            </>
          ) : (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement du widget Chatwoot…
            </>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Démo TransferAI Africa — conversation réelle sur l'agent IA de production. Éviter les données personnelles
          réelles pendant la répétition ou le direct.
        </p>
      </div>
    </div>
  );
};

export default ChatwootWhatsAppDemoPage;
