import { createRoot } from "react-dom/client";
import "./index.css";

const showStartupError = (message: string) => {
  if (typeof document === "undefined") {
    return;
  }

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
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.1;color:#0f172a;">Le site a rencontré une erreur de chargement</h1>
        <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#475569;">Rechargez la page. Si le problème persiste, partagez ce message avec l'équipe technique.</p>
        <pre style="white-space:pre-wrap;word-break:break-word;margin:0;padding:16px;border-radius:14px;background:#f8fafc;color:#0f172a;font-size:14px;line-height:1.5;">${safeMessage}</pre>
      </div>
    </div>
  `;
};

if (typeof window !== "undefined") {
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

  const { default: App } = await import("./App.tsx");
  createRoot(rootElement).render(<App />);
};

bootstrap().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error ?? "Unknown bootstrap error");
  showStartupError(message);
});
