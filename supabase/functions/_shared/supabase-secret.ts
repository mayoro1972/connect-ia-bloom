/**
 * Résolution de la clé secrète Supabase côté serveur.
 *
 * Contexte : depuis la rotation du 20/09/2026, le projet dispose de clés
 * `sb_secret_`. Le runtime des fonctions Edge continue d'exposer
 * `SUPABASE_SERVICE_ROLE_KEY` avec la clé **héritée** ; la nouvelle valeur
 * n'arrive que par `SUPABASE_SECRET_KEYS`, un dictionnaire JSON.
 *
 * On lit donc la nouvelle variable en priorité, avec repli sur l'ancienne
 * tant qu'elle est active. Une fois la clé héritée désactivée, le repli
 * renverra une chaîne vide et la fonction échouera franchement, plutôt que
 * de tourner avec un jeton invalide.
 */

/** Extrait la première valeur ressemblant à une clé secrète dans une structure inconnue. */
const chercherCleSecrete = (valeur: unknown, profondeur = 0): string | null => {
  if (profondeur > 3) return null;
  if (typeof valeur === "string") {
    return valeur.startsWith("sb_secret_") ? valeur : null;
  }
  if (valeur && typeof valeur === "object") {
    for (const enfant of Object.values(valeur as Record<string, unknown>)) {
      const trouve = chercherCleSecrete(enfant, profondeur + 1);
      if (trouve) return trouve;
    }
  }
  return null;
};

/** Clé secrète à utiliser pour créer un client Supabase privilégié. */
export function getSupabaseSecretKey(): string {
  const brut = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (brut) {
    try {
      const trouve = chercherCleSecrete(JSON.parse(brut));
      if (trouve) return trouve;
    } catch {
      // Format inattendu : on retombe sur la clé héritée.
    }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}

/** URL du projet, pour éviter de la répéter dans chaque fonction. */
export function getSupabaseUrl(): string {
  return Deno.env.get("SUPABASE_URL") ?? "";
}

/**
 * Vrai si le jeton présenté par l'appelant est une clé secrète serveur.
 * Accepte la nouvelle clé **et** la clé héritée, le temps de la transition :
 * les appelants (n8n, pg_net) ne basculent pas tous au même instant.
 */
export function estCleServeur(jeton: string | null | undefined): boolean {
  const presente = (jeton ?? "").replace(/^Bearer\s+/i, "").trim();
  if (presente.length === 0) return false;
  const acceptees = [getSupabaseSecretKey(), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""]
    .filter((v) => v.length > 0);
  return acceptees.some((v) => v === presente);
}
