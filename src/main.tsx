import { createRoot } from "react-dom/client";
import "./index.css";

const setDiagnosticStep = (message: string, background = "#10213d") => {
  if (typeof document === "undefined") {
    return;
  }

  const badge = document.getElementById("startup-diagnostic");
  if (!badge) {
    return;
  }

  badge.textContent = message;
  badge.setAttribute(
    "style",
    [
      "position:fixed",
      "left:12px",
      "top:12px",
      "z-index:99999",
      "max-width:calc(100vw - 24px)",
      "padding:10px 14px",
      "border-radius:12px",
      `background:${background}`,
      "color:#ffffff",
      "font:600 12px/1.4 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      "box-shadow:0 10px 30px rgba(15,23,42,.22)",
      "white-space:pre-wrap",
      "word-break:break-word",
    ].join(";"),
  );
};

const showStartupError = (message: string) => {
  if (typeof document === "undefined") {
    return;
  }

  setDiagnosticStep(`Diag erreur: ${message}`, "#b91c1c");

  const root = document.getElementById("root");
  if (!root) {
    return;
  }

  const safeMessage = message
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f7f2ea;padding:24px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:680px;background:#fff;border:1px solid #e7dfd4;border-radius:20px;padding:28px;box-shadow:0 18px 48px rgba(15,23,42,.08);">
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.1;color:#0f172a;">Le site a rencontre une erreur de chargement</h1>
        <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#475569;">Rechargez la page. Si le probleme persiste, partagez ce message avec l'equipe technique.</p>
        <pre style="white-space:pre-wrap;word-break:break-word;margin:0;padding:16px;border-radius:14px;background:#f8fafc;color:#0f172a;font-size:14px;line-height:1.5;">${safeMessage}</pre>
      </div>
    </div>
  `;
};

if (typeof window !== "undefined") {
  setDiagnosticStep("Diag 2/4: JS principal chargé", "#0f766e");

  window.addEventListener("error", (event) => {
    const message = event.error instanceof Error ? event.error.stack ?? event.error.message : String(event.message ?? "Unknown startup error");
    showStartupError(message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason instanceof Error ? event.reason.stack ?? event.reason.message : String(event.reason ?? "Unhandled promise rejection");
    showStartupError(reason);
  });
}

const bootstrap = async () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element #root is missing");
  }

  setDiagnosticStep("Diag 3/4: import de App en cours", "#7c3aed");
  const { default: App } = await import("./App.tsx");
  setDiagnosticStep("Diag 4/4: App importée, rendu React", "#166534");
  createRoot(rootElement).render(<App />);
};

bootstrap().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error ?? "Unknown bootstrap error");
  showStartupError(message);
});
