// Protège uniquement /demo/pre-cloture-bancaire (et ses sous-chemins) par Basic Auth.
// Ce workflow n8n est réel et en production (vrais emails, vraie IA) : contrairement aux
// autres démos publiques du site, on ne veut pas qu'un visiteur anonyme puisse le déclencher
// librement. Le reste du site n'est pas concerné par cette middleware (scope = ce dossier).

interface Env {
  PRECLOTURE_DEMO_USER: string;
  PRECLOTURE_DEMO_PASS: string;
}

function unauthorized(): Response {
  return new Response("Authentification requise.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="TransferAI - Demo Pre-Cloture Bancaire"' },
  });
}

export const onRequest: PagesFunction<Env> = async ({ request, next, env }) => {
  const expectedUser = env.PRECLOTURE_DEMO_USER;
  const expectedPass = env.PRECLOTURE_DEMO_PASS;

  if (!expectedUser || !expectedPass) {
    // Secrets non configurés : on refuse par défaut plutôt que de laisser la page ouverte.
    return unauthorized();
  }

  const authHeader = request.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Basic ")) {
    return unauthorized();
  }

  const decoded = atob(authHeader.slice("Basic ".length));
  const separatorIndex = decoded.indexOf(":");
  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);

  if (user !== expectedUser || pass !== expectedPass) {
    return unauthorized();
  }

  return next();
};
