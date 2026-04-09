import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: loadEnv(mode, process.cwd(), "").VITE_BASE_PATH || "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("react-router-dom") || id.includes("react-dom") || id.includes("/react/")) {
            return "vendor-react";
          }

          if (id.includes("@tanstack/react-query") || id.includes("@supabase/supabase-js")) {
            return "vendor-data";
          }

          if (id.includes("framer-motion")) {
            return "vendor-motion";
          }

          if (id.includes("@radix-ui")) {
            return "vendor-ui";
          }

          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }

          return "vendor-misc";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
