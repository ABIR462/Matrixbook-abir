import OpenAI from 'openai';
import { appEnv, openrouterMissingEnvKeys } from "@/lib/env";

export const hasOpenRouterConfig = openrouterMissingEnvKeys.length === 0;

let openaiClient: OpenAI | null = null;

export function getOpenRouterClient(): OpenAI {
  if (!openaiClient) {
    if (!hasOpenRouterConfig) {
      throw new Error(
        `Missing OpenRouter .env values: ${openrouterMissingEnvKeys.join(", ")}`,
      );
    }

    openaiClient = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: appEnv.openrouter.apiKey,
      dangerouslyAllowBrowser: true, // We are in a client-side environment
      defaultHeaders: {
        "HTTP-Referer": window.location.origin,
        "X-OpenRouter-Title": "MatrixBook",
      },
    });
  }
  return openaiClient;
}

export function explainOpenRouterError(err: any): string {
  const status = err?.status;
  if (status === 401) return "Invalid OpenRouter API key (401)";
  if (status === 429) return "Rate limit hit — check OpenRouter credits (429)";
  if (status === 402) return "Insufficient credits on OpenRouter (402)";
  
  return err?.message || "AI generation failed";
}

if (!hasOpenRouterConfig) {
  console.warn(
    `[MatrixBook] Missing OpenRouter .env values: ${openrouterMissingEnvKeys.join(", ")}.`,
  );
}
