import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: "0.0.0.0",
      port: 3000,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api/codestral": {
          target: "https://codestral.mistral.ai",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/codestral/, ""),
        },
      },
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ""),
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});

