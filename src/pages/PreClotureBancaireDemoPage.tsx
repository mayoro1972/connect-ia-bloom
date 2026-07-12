import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Landmark, Loader2, Plus, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured, supabase, supabaseUnavailableMessage } from "@/integrations/supabase/client";
import { trackAnalyticsEvent } from "@/lib/analytics";

type AccountRow = {
  id: string;
  account_code: string;
  account_label: string;
  current_amount: number;
  previous_amount: number;
  support_required: boolean;
  support_received: boolean;
  owner: string;
};

const defaultRows: AccountRow[] = [
  { id: "r1", account_code: "512000", account_label: "Banque principale", current_amount: 325000000, previous_amount: 282000000, support_required: true, support_received: true, owner: "Trésorerie" },
  { id: "r2", account_code: "471200", account_label: "Compte d'attente opérations cartes", current_amount: 18900000, previous_amount: 4200000, support_required: true, support_received: false, owner: "Opérations bancaires" },
  { id: "r3", account_code: "616300", account_label: "Frais réseau et télétransmission", current_amount: 28400000, previous_amount: 29100000, support_required: false, support_received: false, owner: "Back office" },
  { id: "r4", account_code: "445700", account_label: "TVA à régulariser", current_amount: 21700000, previous_amount: 7600000, support_required: true, support_received: false, owner: "Comptabilité fiscale" },
  { id: "r5", account_code: "628100", account_label: "Charges diverses à justifier", current_amount: 9600000, previous_amount: 1180000, support_required: true, support_received: false, owner: "Comptabilité générale" },
];

const emptyRow = (): AccountRow => ({
  id: `r${Date.now()}`,
  account_code: "",
  account_label: "",
  current_amount: 0,
  previous_amount: 0,
  support_required: true,
  support_received: false,
  owner: "",
});

const PreClotureBancaireDemoPage = () => {
  const [entity, setEntity] = useState("Continental Atlantic Bank - Direction Financière");
  const [reportPeriod, setReportPeriod] = useState("Juillet 2026");
  const [currency, setCurrency] = useState("FCFA");
  const [managerEmail, setManagerEmail] = useState("");
  const [recipients, setRecipients] = useState("");
  const [absThreshold, setAbsThreshold] = useState("10000000");
  const [relThreshold, setRelThreshold] = useState("0.15");
  const [rows, setRows] = useState<AccountRow[]>(defaultRows);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ manager_email: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateRow = (id: string, patch: Partial<AccountRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting || !entity.trim() || !reportPeriod.trim() || !managerEmail.trim() || rows.length === 0) {
      return;
    }

    setSubmitting(true);
    setSuccess(null);
    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage(supabaseUnavailableMessage);
      setSubmitting(false);
      return;
    }

    trackAnalyticsEvent("pre_cloture_bancaire_demo_submit", { rows_count: rows.length });

    const { data, error } = await supabase.functions.invoke("pre-cloture-bancaire-demo", {
      body: {
        entity: entity.trim(),
        report_period: reportPeriod.trim(),
        currency: currency.trim() || "FCFA",
        manager_email: managerEmail.trim(),
        recipients: recipients.split(",").map((s) => s.trim()).filter(Boolean),
        absolute_variation_threshold: Number(absThreshold || 0),
        relative_variation_threshold: Number(relThreshold || 0),
        rows: rows.map(({ id: _id, ...rest }) => rest),
      },
    });

    if (error || !data || data.error) {
      const message =
        (data && (data.detail || data.error)) ||
        error?.message ||
        "Le workflow n8n n'a pas répondu. Vérifie que le webhook est actif.";
      setErrorMessage(String(message));
      setSubmitting(false);
      return;
    }

    setSuccess({ manager_email: data.manager_email ?? managerEmail.trim() });
    setSubmitting(false);
  };

  const reset = () => {
    setSuccess(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1F2937]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#6B7280] hover:text-[#0A2647] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Retour au site
        </Link>

        {/* Bandeau bancaire */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-gradient-to-b from-[#0A2647] to-[#071A33] px-7 py-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/40 bg-gradient-to-br from-[#E8D9B5] to-[#8A6D33] font-serif text-base font-bold text-[#071A33]">
              CAB
            </div>
            <div>
              <div className="font-serif text-xl text-white">Continental Atlantic Bank</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#E8D9B5]">
                Direction Financière — Contrôle de Gestion
              </div>
            </div>
          </div>
          <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-wider text-white">
            Environnement de démonstration
          </div>
        </div>

        <div className="mb-2 inline-flex items-center gap-2 rounded-sm border border-[#0A2647]/20 bg-[#0A2647]/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0A2647]">
          <ShieldCheck className="h-3 w-3" /> Démo live — Pré-Clôture Bancaire avec Validation Humaine
        </div>
        <h1 className="mb-3 max-w-2xl font-serif text-3xl font-bold leading-tight text-[#0A2647] md:text-4xl">
          Saisis les données, regarde le contrôle se faire en direct
        </h1>
        <p className="mb-3 max-w-2xl text-[15px] leading-relaxed text-[#4B5563]">
          Ce formulaire déclenche le vrai workflow n8n de production&nbsp;: détection des écarts, anonymisation des
          données sensibles, synthèse rédigée par IA, puis dé-anonymisation avant l'envoi au responsable pour
          validation humaine.
        </p>
        <p className="mb-8 max-w-2xl text-[12px] font-medium text-[#B3261E]">
          ⚠ Un email réel de validation sera envoyé à l'adresse renseignée ci-dessous.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-[#D8DEE6] bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b-2 border-[#E8D9B5] pb-2 font-serif text-lg font-bold text-[#0A2647]">
              Paramètres de la revue
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#374151]">Entité</label>
                <Input value={entity} onChange={(e) => setEntity(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#374151]">Période de clôture</label>
                <Input value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#374151]">Devise</label>
                <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#374151]">Email du responsable (validation)</label>
                <Input type="email" required value={managerEmail} onChange={(e) => setManagerEmail(e.target.value)} placeholder="responsable@exemple.com" />
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-[#374151]">Destinataires de la synthèse finale (séparés par une virgule)</label>
                <Input value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder="comptabilite@exemple.com, audit@exemple.com" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#374151]">Seuil de variation — montant</label>
                <Input type="number" value={absThreshold} onChange={(e) => setAbsThreshold(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#374151]">Seuil de variation — pourcentage</label>
                <Input type="number" step="0.01" value={relThreshold} onChange={(e) => setRelThreshold(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#D8DEE6] bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b-2 border-[#E8D9B5] pb-2 font-serif text-lg font-bold text-[#0A2647]">
              Comptes à analyser
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#0A2647] text-[11px] uppercase tracking-wide text-white">
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Libellé</th>
                    <th className="p-2 text-left">Solde actuel</th>
                    <th className="p-2 text-left">Solde précédent</th>
                    <th className="p-2 text-center">Justif. requis</th>
                    <th className="p-2 text-center">Justif. reçu</th>
                    <th className="p-2 text-left">Responsable</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-[#E5E7EB]">
                      <td className="p-1.5">
                        <input className="w-24 rounded border border-[#D8DEE6] px-2 py-1" value={row.account_code} onChange={(e) => updateRow(row.id, { account_code: e.target.value })} />
                      </td>
                      <td className="p-1.5">
                        <input className="w-40 rounded border border-[#D8DEE6] px-2 py-1" value={row.account_label} onChange={(e) => updateRow(row.id, { account_label: e.target.value })} />
                      </td>
                      <td className="p-1.5">
                        <input type="number" className="w-28 rounded border border-[#D8DEE6] px-2 py-1" value={row.current_amount} onChange={(e) => updateRow(row.id, { current_amount: Number(e.target.value || 0) })} />
                      </td>
                      <td className="p-1.5">
                        <input type="number" className="w-28 rounded border border-[#D8DEE6] px-2 py-1" value={row.previous_amount} onChange={(e) => updateRow(row.id, { previous_amount: Number(e.target.value || 0) })} />
                      </td>
                      <td className="p-1.5 text-center">
                        <input type="checkbox" checked={row.support_required} onChange={(e) => updateRow(row.id, { support_required: e.target.checked })} />
                      </td>
                      <td className="p-1.5 text-center">
                        <input type="checkbox" checked={row.support_received} onChange={(e) => updateRow(row.id, { support_received: e.target.checked })} />
                      </td>
                      <td className="p-1.5">
                        <input className="w-32 rounded border border-[#D8DEE6] px-2 py-1" value={row.owner} onChange={(e) => updateRow(row.id, { owner: e.target.value })} />
                      </td>
                      <td className="p-1.5 text-center">
                        <button type="button" onClick={() => removeRow(row.id)} className="text-[#B3261E] hover:opacity-70" title="Supprimer">
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={() => setRows((prev) => [...prev, emptyRow()])}
              className="mt-3 inline-flex items-center gap-1.5 rounded border border-dashed border-[#0A2647] px-3 py-1.5 text-xs font-semibold text-[#0A2647] hover:bg-[#F4F6F9]"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter un compte
            </button>
          </div>

          <div className="rounded-lg border border-[#D8DEE6] bg-white p-6 shadow-sm">
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting} className="bg-[#0A2647] px-8 text-white hover:bg-[#071A33]">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Landmark className="mr-2 h-4 w-4" />}
                {submitting ? "Transmission en cours…" : "Lancer la revue de pré-clôture"}
              </Button>
            </div>

            {errorMessage ? (
              <p className="mt-4 rounded border border-[#B3261E]/30 bg-[#B3261E]/5 p-3 text-xs text-[#B3261E]">
                {errorMessage}
              </p>
            ) : null}

            {success ? (
              <div className="mt-4 flex items-start gap-2 rounded border border-[#0D7A4F]/30 bg-[#0D7A4F]/5 p-3 text-sm text-[#0D7A4F]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <strong>Revue de pré-clôture lancée avec succès.</strong>
                  <br />
                  Un email de validation va être envoyé à <strong>{success.manager_email}</strong>.
                  <br />
                  <button type="button" onClick={reset} className="mt-2 text-xs uppercase tracking-wider text-[#0D7A4F]/80 hover:text-[#0D7A4F]">
                    Lancer une nouvelle revue
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-[#9CA3AF]">
          Portail de démonstration — TransferAI Africa. Données fictives, aucune information réelle de client.
        </p>
      </div>
    </div>
  );
};

export default PreClotureBancaireDemoPage;
