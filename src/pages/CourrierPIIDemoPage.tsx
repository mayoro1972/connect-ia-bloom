import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  MailCheck,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

const COOLDOWN_MS = 60_000;
const COOLDOWN_STORAGE_KEY = "courrier_pii_demo_last_run";

type ScenarioId = "diplomatie" | "rh" | "finance" | "marketing" | "education";

type Scenario = {
  id: ScenarioId;
  sector: string;
  pillActive: string;
  pillInactive: string;
  destinataire: string;
  destinataireEmail: string;
  objet: string;
  expediteur: string;
  organisation: string;
  demandeText: string;
  sensitiveValues: string[];
  anonymisedText: string;
  gptDraftText: string;
  finalText: string;
  restoredValues: string[];
};

const scenarios: Scenario[] = [
  {
    id: "diplomatie",
    sector: "Diplomatie",
    pillActive: "border-violet-400/40 bg-violet-400/15 text-violet-200",
    pillInactive: "border-white/10 text-slate-400 hover:text-slate-200",
    destinataire: "Ambassade du Royaume du Maroc à Abidjan",
    destinataireEmail: "protocole@ambassade-maroc-ci.example",
    objet: "Confirmation de rendez-vous et accréditation",
    expediteur: "Cabinet du Secrétaire Général",
    organisation: "Ministère des Affaires Étrangères de Côte d'Ivoire",
    demandeText:
      "Merci de rédiger un courrier confirmant à M. Abdellah Benkirane que sa demande a été validée, référence diplomatique : DIP-2026-04471. Il est domicilié à la Résidence de l'Ambassade, Riviera Golf, Abidjan. Le joindre au +225 07 45 12 33 89 ou par email a.benkirane@diplomatie-test.example.",
    sensitiveValues: [
      "M. Abdellah Benkirane",
      "référence diplomatique : DIP-2026-04471",
      "domicilié à la Résidence de l'Ambassade",
      "+225 07 45 12 33 89",
      "a.benkirane@diplomatie-test.example",
    ],
    anonymisedText:
      "Merci de rédiger un courrier confirmant à [PERSONNE_1] que sa demande a été validée, référence diplomatique : [REFERENCE_1]. Il est domicilié à [ADRESSE_1], Riviera Golf, Abidjan. Le joindre au [TELEPHONE_1] ou par email [EMAIL_1].",
    gptDraftText:
      "Nous avons le plaisir de confirmer à [PERSONNE_1] que sa demande a été validée. La référence diplomatique associée est [REFERENCE_1].\n\nNous vous prions de bien vouloir noter que [PERSONNE_1] est domicilié à [ADRESSE_1], Riviera Golf, Abidjan. Pour toute communication ultérieure, vous pouvez le joindre au [TELEPHONE_1] ou par email à [EMAIL_1].\n\nNous restons à votre disposition pour toute information complémentaire.\n\nVeuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.\n\nCabinet du Secrétaire Général\nMinistère des Affaires Étrangères de Côte d'Ivoire",
    finalText:
      "Nous avons le plaisir de confirmer à M. Abdellah Benkirane que sa demande a été validée. La référence diplomatique associée est DIP-2026-04471.\n\nNous vous prions de bien vouloir noter que M. Abdellah Benkirane est domicilié à la Résidence de l'Ambassade, Riviera Golf, Abidjan. Pour toute communication ultérieure, vous pouvez le joindre au +225 07 45 12 33 89 ou par email à a.benkirane@diplomatie-test.example.\n\nNous restons à votre disposition pour toute information complémentaire.\n\nVeuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.\n\nCabinet du Secrétaire Général\nMinistère des Affaires Étrangères de Côte d'Ivoire",
    restoredValues: [
      "M. Abdellah Benkirane",
      "DIP-2026-04471",
      "la Résidence de l'Ambassade",
      "+225 07 45 12 33 89",
      "a.benkirane@diplomatie-test.example",
    ],
  },
  {
    id: "rh",
    sector: "Ressources Humaines",
    pillActive: "border-teal-400/40 bg-teal-400/15 text-teal-200",
    pillInactive: "border-white/10 text-slate-400 hover:text-slate-200",
    destinataire: "M. Serge Yao",
    destinataireEmail: "serge.yao@exemple-rh.test",
    objet: "Convocation à un entretien",
    expediteur: "Direction des Ressources Humaines",
    organisation: "Entreprise Test SARL",
    demandeText:
      "Merci de convoquer M. Serge Yao pour un entretien disciplinaire. CNI n° CI0045781239. Il est domicilié à Yopougon Selmer, Abidjan. Le joindre au 05 89 23 47 11 ou par email serge.yao@exemple-rh.test.",
    sensitiveValues: [
      "M. Serge Yao",
      "CNI n° CI0045781239",
      "domicilié à Yopougon Selmer",
      "05 89 23 47 11",
      "serge.yao@exemple-rh.test",
    ],
    anonymisedText:
      "Merci de convoquer [PERSONNE_1] pour un entretien disciplinaire. CNI n° [CNI_1]. Il est domicilié à [ADRESSE_1], Abidjan. Le joindre au [TELEPHONE_1] ou par email [EMAIL_1].",
    gptDraftText:
      "Nous vous informons que [PERSONNE_1] est convoqué à un entretien disciplinaire. Cet entretien se tiendra dans nos locaux à une date et heure qui vous seront communiquées ultérieurement.\n\nPour rappel, [PERSONNE_1] est identifié par la CNI n° [CNI_1] et réside à [ADRESSE_1], Abidjan. Pour toute question ou précision, vous pouvez le joindre au [TELEPHONE_1] ou par email à [EMAIL_1].\n\nNous vous prions de bien vouloir vous présenter à cet entretien muni de tous les documents nécessaires.\n\nNous vous remercions de votre compréhension et de votre coopération.\n\nVeuillez agréer, Monsieur, l'expression de nos salutations distinguées.\n\nDirection des Ressources Humaines\nEntreprise Test SARL",
    finalText:
      "Nous vous informons que M. Serge Yao est convoqué à un entretien disciplinaire. Cet entretien se tiendra dans nos locaux à une date et heure qui vous seront communiquées ultérieurement.\n\nPour rappel, M. Serge Yao est identifié par la CNI n° CI0045781239 et réside à Yopougon Selmer, Abidjan. Pour toute question ou précision, vous pouvez le joindre au 05 89 23 47 11 ou par email à serge.yao@exemple-rh.test.\n\nNous vous prions de bien vouloir vous présenter à cet entretien muni de tous les documents nécessaires.\n\nNous vous remercions de votre compréhension et de votre coopération.\n\nVeuillez agréer, Monsieur, l'expression de nos salutations distinguées.\n\nDirection des Ressources Humaines\nEntreprise Test SARL",
    restoredValues: [
      "M. Serge Yao",
      "CI0045781239",
      "Yopougon Selmer",
      "05 89 23 47 11",
      "serge.yao@exemple-rh.test",
    ],
  },
  {
    id: "finance",
    sector: "Banque / Finance",
    pillActive: "border-amber-400/40 bg-amber-400/15 text-amber-200",
    pillInactive: "border-white/10 text-slate-400 hover:text-slate-200",
    destinataire: "Mme Adjoua Kouassi",
    destinataireEmail: "a.kouassi@client-banque-test.example",
    objet: "Confirmation de réception de virement",
    expediteur: "Service Relation Client",
    organisation: "Banque Test CI",
    demandeText:
      "Merci d'informer Mme Adjoua Kouassi que le virement de 2 500 000 FCFA vers son IBAN CI93CI0080123456789012345 a bien été reçu. Son passeport n° 12AB34567 reste en cours de vérification. Adresse : Cocody 2 Plateaux, Abidjan. La joindre au 07 12 34 56 78.",
    sensitiveValues: [
      "Mme Adjoua Kouassi",
      "2 500 000 FCFA",
      "CI93CI0080123456789012345",
      "passeport n° 12AB34567",
      "Cocody 2 Plateaux",
      "07 12 34 56 78",
    ],
    anonymisedText:
      "Merci d'informer [PERSONNE_1] que le virement de [MONTANT_1] vers son IBAN [IBAN_1] a bien été reçu. Son passeport n° [PASSEPORT_1] reste en cours de vérification. Adresse : [ADRESSE_1], Abidjan. La joindre au [TELEPHONE_1].",
    gptDraftText:
      "Nous vous confirmons la réception du virement de [MONTANT_1] vers l'IBAN [IBAN_1]. Nous vous prions d'informer [PERSONNE_1] de cette bonne réception. Par ailleurs, nous tenons à vous informer que le passeport n° [PASSEPORT_1] reste en cours de vérification.\n\nPour toute question complémentaire, vous pouvez joindre [PERSONNE_1] à l'adresse suivante : [ADRESSE_1], Abidjan, ou par téléphone au [TELEPHONE_1].\n\nNous vous prions d'agréer, Madame, l'expression de nos salutations distinguées.\n\nService Relation Client\nBanque Test CI",
    finalText:
      "Nous vous confirmons la réception du virement de 2 500 000 FCFA vers l'IBAN CI93CI0080123456789012345. Nous vous prions d'informer Mme Adjoua Kouassi de cette bonne réception. Par ailleurs, nous tenons à vous informer que le passeport n° 12AB34567 reste en cours de vérification.\n\nPour toute question complémentaire, vous pouvez joindre Mme Adjoua Kouassi à l'adresse suivante : Cocody 2 Plateaux, Abidjan, ou par téléphone au 07 12 34 56 78.\n\nNous vous prions d'agréer, Madame, l'expression de nos salutations distinguées.\n\nService Relation Client\nBanque Test CI",
    restoredValues: [
      "Mme Adjoua Kouassi",
      "2 500 000 FCFA",
      "CI93CI0080123456789012345",
      "12AB34567",
      "Cocody 2 Plateaux",
      "07 12 34 56 78",
    ],
  },
  {
    id: "marketing",
    sector: "Marketing",
    pillActive: "border-rose-400/40 bg-rose-400/15 text-rose-200",
    pillInactive: "border-white/10 text-slate-400 hover:text-slate-200",
    destinataire: "Agence Kaydan Digital",
    destinataireEmail: "contact@kaydan-digital-test.example",
    objet: "Confirmation de collaboration campagne Q3 2026",
    expediteur: "Direction Marketing",
    organisation: "TransferAI Africa",
    demandeText:
      "Merci de confirmer à Mme Fatou Diarra que le budget de campagne de 8 500 000 FCFA a été validé, référence contrat : MKT-2026-0092. Elle est joignable au 07 33 22 11 44 ou par email f.diarra@kaydan-digital-test.example.",
    sensitiveValues: [
      "Mme Fatou Diarra",
      "8 500 000 FCFA",
      "référence contrat : MKT-2026-0092",
      "07 33 22 11 44",
      "f.diarra@kaydan-digital-test.example",
    ],
    anonymisedText:
      "Merci de confirmer à [PERSONNE_1] que le budget de campagne de [MONTANT_1] a été validé, référence contrat : [REFERENCE_1]. Elle est joignable au [TELEPHONE_1] ou par email [EMAIL_1].",
    gptDraftText:
      "Nous avons le plaisir de vous confirmer la validation du budget de campagne s'élevant à [MONTANT_1], conformément à notre accord de partenariat. La référence de contrat associée est [REFERENCE_1].\n\nPour toute question ou information complémentaire, merci de bien vouloir contacter [PERSONNE_1]. Elle est joignable au [TELEPHONE_1] ou par email à l'adresse suivante : [EMAIL_1].\n\nDans l'attente de notre collaboration fructueuse,\n\nCordialement,\n\nDirection Marketing\nTransferAI Africa",
    finalText:
      "Nous avons le plaisir de vous confirmer la validation du budget de campagne s'élevant à 8 500 000 FCFA, conformément à notre accord de partenariat. La référence de contrat associée est MKT-2026-0092.\n\nPour toute question ou information complémentaire, merci de bien vouloir contacter Mme Fatou Diarra. Elle est joignable au 07 33 22 11 44 ou par email à l'adresse suivante : f.diarra@kaydan-digital-test.example.\n\nDans l'attente de notre collaboration fructueuse,\n\nCordialement,\n\nDirection Marketing\nTransferAI Africa",
    restoredValues: [
      "Mme Fatou Diarra",
      "8 500 000 FCFA",
      "MKT-2026-0092",
      "07 33 22 11 44",
      "f.diarra@kaydan-digital-test.example",
    ],
  },
  // Scénario construit le 07/08/2026 pour la démonstration Pigier CI. Le déclenchement réel a été
  // testé sur le webhook n8n de prod (courrier_id CRR-1786139796434, statut sent_for_validation confirmé),
  // mais gptDraftText/finalText ci-dessous sont rédigés à la main en suivant les règles de prompt déjà
  // validées (co-013), pas capturés depuis l'email réel — à comparer avec l'email reçu par Marius avant
  // de présenter ce scénario comme intégralement vérifié, comme pour les 4 autres secteurs.
  {
    id: "education",
    sector: "Éducation",
    pillActive: "border-sky-400/40 bg-sky-400/15 text-sky-200",
    pillInactive: "border-white/10 text-slate-400 hover:text-slate-200",
    destinataire: "Mme Aïcha Traoré",
    destinataireEmail: "a.traore@etudiant-pigier-test.example",
    objet: "Convocation - entretien disciplinaire",
    expediteur: "Direction de la Vie Étudiante",
    organisation: "Pigier Côte d'Ivoire (scénario de démonstration)",
    demandeText:
      "Merci de convoquer Mme Aïcha Traoré, étudiante, référence dossier : PIG-2026-00734, pour un entretien disciplinaire suite à un incident signalé en salle de cours. Adresse : Cocody Angré, Abidjan. La joindre au 07 65 43 21 09 ou par email a.traore@etudiant-pigier-test.example. Copie à envoyer au tuteur légal, M. Ibrahim Traoré, joignable au 05 12 34 56 78.",
    sensitiveValues: [
      "Mme Aïcha Traoré",
      "référence dossier : PIG-2026-00734",
      "Cocody Angré",
      "07 65 43 21 09",
      "a.traore@etudiant-pigier-test.example",
      "M. Ibrahim Traoré",
      "05 12 34 56 78",
    ],
    anonymisedText:
      "Merci de convoquer [PERSONNE_1], étudiante, référence dossier : [REFERENCE_1], pour un entretien disciplinaire suite à un incident signalé en salle de cours. Adresse : [ADRESSE_1], Abidjan. La joindre au [TELEPHONE_1] ou par email [EMAIL_1]. Copie à envoyer au tuteur légal, [PERSONNE_2], joignable au [TELEPHONE_2].",
    gptDraftText:
      "Nous vous informons que [PERSONNE_1] est convoquée à un entretien disciplinaire suite à un incident signalé en salle de cours. Cet entretien se tiendra dans nos locaux à une date et heure qui vous seront communiquées ultérieurement.\n\nPour rappel, [PERSONNE_1] est enregistrée sous la référence dossier [REFERENCE_1] et réside à [ADRESSE_1], Abidjan. Vous pouvez la joindre au [TELEPHONE_1] ou par email à [EMAIL_1].\n\nUne copie de cette convocation sera transmise au tuteur légal, [PERSONNE_2], joignable au [TELEPHONE_2].\n\nNous vous remercions de votre compréhension et de votre coopération.\n\nVeuillez agréer, Madame, l'expression de nos salutations distinguées.\n\nDirection de la Vie Étudiante\nPigier Côte d'Ivoire (scénario de démonstration)",
    finalText:
      "Nous vous informons que Mme Aïcha Traoré est convoquée à un entretien disciplinaire suite à un incident signalé en salle de cours. Cet entretien se tiendra dans nos locaux à une date et heure qui vous seront communiquées ultérieurement.\n\nPour rappel, Mme Aïcha Traoré est enregistrée sous la référence dossier PIG-2026-00734 et réside à Cocody Angré, Abidjan. Vous pouvez la joindre au 07 65 43 21 09 ou par email à a.traore@etudiant-pigier-test.example.\n\nUne copie de cette convocation sera transmise au tuteur légal, M. Ibrahim Traoré, joignable au 05 12 34 56 78.\n\nNous vous remercions de votre compréhension et de votre coopération.\n\nVeuillez agréer, Madame, l'expression de nos salutations distinguées.\n\nDirection de la Vie Étudiante\nPigier Côte d'Ivoire (scénario de démonstration)",
    restoredValues: [
      "Mme Aïcha Traoré",
      "PIG-2026-00734",
      "Cocody Angré",
      "07 65 43 21 09",
      "a.traore@etudiant-pigier-test.example",
      "M. Ibrahim Traoré",
      "05 12 34 56 78",
    ],
  },
];

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const Highlight = ({ tone, children }: { tone: "sensitive" | "token" | "restored"; children: ReactNode }) => {
  const cls =
    tone === "sensitive"
      ? "rounded bg-rose-400/15 px-1 py-0.5 font-semibold text-rose-200"
      : tone === "token"
        ? "rounded bg-violet-400/15 px-1.5 py-0.5 font-mono text-[13px] text-violet-200"
        : "rounded bg-emerald-400/15 px-1 py-0.5 text-emerald-200";
  return <span className={cls}>{children}</span>;
};

const TOKEN_RE = /\[[A-Z_]+_\d+\]/g;

function renderTokenised(text: string): ReactNode[] {
  const tokens = text.match(TOKEN_RE) ?? [];
  const parts = text.split(TOKEN_RE);
  const nodes: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (part) nodes.push(<span key={`p${i}`}>{part}</span>);
    if (tokens[i]) nodes.push(
      <Highlight key={`t${i}`} tone="token">
        {tokens[i]}
      </Highlight>,
    );
  });
  return nodes;
}

function renderHighlighted(text: string, values: string[], tone: "sensitive" | "restored"): ReactNode[] {
  if (values.length === 0) return [<span key="only">{text}</span>];
  const sorted = [...values].sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${sorted.map(escapeRegExp).join("|")})`, "g");
  return text.split(re).map((part, i) =>
    values.includes(part) ? (
      <Highlight key={i} tone={tone}>
        {part}
      </Highlight>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

const MultiLine = ({ children }: { children: ReactNode[] }) => {
  // children peut contenir des \n à l'intérieur des morceaux de texte bruts ; on les
  // convertit en sauts de paragraphe visibles sans perdre le surlignage déjà appliqué.
  return (
    <p className="whitespace-pre-line text-[15px] leading-8 text-slate-300">{children}</p>
  );
};

type Step = {
  label: string;
  title: string;
  render: (s: Scenario) => ReactNode;
};

const steps: Step[] = [
  {
    label: "1. Demande",
    title: "La secrétaire soumet sa demande",
    render: (s) => (
      <div className="space-y-3 text-[15px] leading-7 text-slate-300">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Destinataire</p>
          <p>{s.destinataire}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Objet</p>
          <p>{s.objet}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Instructions</p>
          <MultiLine>{renderHighlighted(s.demandeText, s.sensitiveValues, "sensitive")}</MultiLine>
        </div>
        <p className="text-xs text-slate-500">
          En rouge&nbsp;: les données sensibles réelles, saisies telles quelles par la secrétaire.
        </p>
      </div>
    ),
  },
  {
    label: "2. PII Guard",
    title: "PII Guard masque les données avant l'IA",
    render: (s) => (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-violet-300" />
          Sous-workflow PII_Guard_Anonymisation — mode anonymize
        </div>
        <MultiLine>{renderTokenised(s.anonymisedText)}</MultiLine>
        <p className="text-xs text-slate-500">
          C&apos;est ce texte — et uniquement celui-ci — qui part vers l&apos;API OpenAI. Aucune donnée réelle ne
          quitte jamais n8n à cette étape.
        </p>
      </div>
    ),
  },
  {
    label: "3. GPT-4o",
    title: "GPT-4o rédige le brouillon",
    render: (s) => (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" />
          Réponse réelle de l&apos;API OpenAI (gpt-4o)
        </div>
        <MultiLine>{renderTokenised(s.gptDraftText)}</MultiLine>
        <p className="text-xs text-slate-500">
          Le modèle recopie les jetons tels quels — il ne les invente jamais, il ne les « devine » jamais.
        </p>
      </div>
    ),
  },
  {
    label: "4. Manager",
    title: "Le manager reçoit l'email de validation",
    render: (s) => (
      <div className="space-y-3">
        <div className="rounded-lg border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400">
            <p>De : courrier@transferai.ci</p>
            <p className="mt-0.5">À : (email du manager de validation)</p>
            <p className="mt-1.5 text-sm text-slate-200">Validation requise — {s.objet}</p>
          </div>
          <div className="px-4 py-4">
            <MultiLine>{renderHighlighted(s.finalText, s.restoredValues, "restored")}</MultiLine>
            <div className="mt-4 flex gap-2">
              <span className="rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                Approuver
              </span>
              <span className="rounded border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-200">
                Rejeter
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          En vert&nbsp;: les données réelles, restaurées uniquement pour le manager — un humain autorisé, pas
          l&apos;IA.
        </p>
      </div>
    ),
  },
  {
    label: "5. Client",
    title: "Le destinataire reçoit le courrier final",
    render: (s) => (
      <div className="space-y-3">
        <div className="rounded-lg border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400">
            <p>De : courrier@transferai.ci</p>
            <p className="mt-0.5">À : {s.destinataireEmail}</p>
            <p className="mt-1.5 text-sm text-slate-200">{s.objet}</p>
          </div>
          <div className="px-4 py-4">
            <MultiLine>{renderHighlighted(s.finalText, s.restoredValues, "restored")}</MultiLine>
          </div>
          <div className="flex items-center gap-2 rounded-b-lg bg-emerald-400/10 px-4 py-2.5">
            <Check className="h-3.5 w-3.5 text-emerald-300" />
            <p className="text-xs text-emerald-200">Courrier envoyé</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Cycle complet&nbsp;: demande, IA sans PII, validation humaine, envoi — testé en direct sur l&apos;instance
          de production.
        </p>
      </div>
    ),
  },
];

const CourrierPIIDemoPage = () => {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("diplomatie");
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const [active, setActive] = useState(0);
  const [visitorName, setVisitorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ courrier_id: string | null } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number>(() => {
    const stored = Number(localStorage.getItem(COOLDOWN_STORAGE_KEY) ?? "0");
    return stored + COOLDOWN_MS > Date.now() ? stored + COOLDOWN_MS : 0;
  });

  const onCooldown = cooldownUntil > Date.now();

  const changeScenario = (id: ScenarioId) => {
    setScenarioId(id);
    setActive(0);
    setResult(null);
    setErrorMessage(null);
  };

  const handleLiveDemo = async () => {
    if (submitting || onCooldown) return;

    setSubmitting(true);
    setResult(null);
    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage(supabaseUnavailableMessage);
      setSubmitting(false);
      return;
    }

    trackAnalyticsEvent("courrier_pii_demo_live_submit", {
      has_visitor_name: Boolean(visitorName.trim()),
      scenario: scenarioId,
    });

    const { data, error } = await supabase.functions.invoke("courrier-automatique-pii-demo", {
      body: { visitor_name: visitorName.trim(), scenario: scenarioId },
    });

    if (error || !data || data.error) {
      const message =
        (data && (data.detail || data.error)) ||
        error?.message ||
        "Le workflow n8n n'a pas répondu. Réessaie dans quelques instants.";
      setErrorMessage(String(message));
      setSubmitting(false);
      return;
    }

    const now = Date.now();
    localStorage.setItem(COOLDOWN_STORAGE_KEY, String(now));
    setCooldownUntil(now + COOLDOWN_MS);
    setResult({ courrier_id: data.courrier_id ?? null });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#2d1f47_0%,#170f28_40%,#0a0714_100%)] text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-violet-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au site
          </Link>
          <Badge className="border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
            Démo live — déclenche le vrai workflow n8n
          </Badge>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Courrier confidentiel généré par IA
              </div>
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-5xl">
              Une IA qui rédige vos courriers <span className="text-violet-300">sans jamais voir vos données sensibles</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-300">
              Le même pipeline s&apos;adapte à n&apos;importe quel secteur&nbsp;: c&apos;est PII Guard qui masque les
              données sensibles, quelles qu&apos;elles soient, avant tout appel à l&apos;IA générative — pas un
              scénario écrit à l&apos;avance. Choisis un secteur ci-dessous pour voir le même workflow rédiger un
              courrier différent.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => changeScenario(s.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    scenarioId === s.id ? s.pillActive : s.pillInactive
                  }`}
                >
                  {s.sector}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-4 w-4 text-violet-300" />
                    Anonymisation locale
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Détection par expressions régulières (IBAN, passeport, montant, référence, adresse,
                  téléphone...) — aucun appel externe pour la détection elle-même.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-4 w-4 text-violet-300" />
                    IA sans PII
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  GPT-4o ne reçoit que des jetons neutres — il recopie{" "}
                  <Highlight tone="token">[TYPE_n]</Highlight> sans jamais voir la donnée réelle, quel que soit le
                  secteur.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-slate-100 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserCheck className="h-4 w-4 text-violet-300" />
                    Validation humaine
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-slate-300">
                  Le manager valide le fond et la signature ; seule la secrétaire à l&apos;origine de la demande
                  déclenche l&apos;envoi réel.
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Essaie-le en direct</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Déclenche le scénario <strong>{scenario.sector}</strong> ci-contre pour de vrai : anonymisation
              réelle, vrai appel GPT-4o, et un vrai email de validation envoyé au manager de la démo.
            </p>
            <Input
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="Ton prénom (optionnel)"
              className="mt-4 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500"
            />
            <Button
              type="button"
              onClick={handleLiveDemo}
              disabled={submitting || onCooldown}
              className="mt-3 w-full bg-violet-300 text-slate-950 hover:bg-violet-200"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {submitting
                ? "Envoi en cours…"
                : onCooldown
                  ? "Patiente un instant avant de relancer"
                  : `Lancer la démonstration réelle — ${scenario.sector}`}
            </Button>

            {errorMessage ? (
              <p className="mt-3 rounded border border-rose-400/30 bg-rose-400/5 p-2.5 text-xs text-rose-200">
                {errorMessage}
              </p>
            ) : null}

            {result ? (
              <div className="mt-3 flex items-start gap-2 rounded border border-emerald-400/30 bg-emerald-400/5 p-2.5 text-xs text-emerald-200">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <div>
                  Workflow déclenché{result.courrier_id ? ` (réf. ${result.courrier_id})` : ""}. L&apos;email de
                  validation manager part à l&apos;instant.
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
                <MailCheck className="h-3.5 w-3.5" />
                Cycle validé en conditions réelles
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-wrap gap-2">
            {steps.map((step, i) => (
              <button
                key={step.label}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  active === i
                    ? "bg-violet-400/20 text-violet-200"
                    : "border border-white/10 text-slate-400 hover:text-slate-200"
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          <Card className="mt-4 border-white/10 bg-white/5 text-slate-100 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">{steps[active].title}</CardTitle>
            </CardHeader>
            <CardContent>{steps[active].render(scenario)}</CardContent>
          </Card>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100 ${
                active === 0 ? "invisible" : ""
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Précédent
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => Math.min(steps.length - 1, i + 1))}
              className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-slate-100 ${
                active === steps.length - 1 ? "invisible" : ""
              }`}
            >
              Suivant
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-slate-500">
          Portail de démonstration — TransferAI Africa. Données fictives, aucune information réelle de client.
        </p>
      </div>
    </div>
  );
};

export default CourrierPIIDemoPage;
