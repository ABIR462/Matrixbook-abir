import { getOpenRouterClient, hasOpenRouterConfig, explainOpenRouterError } from "@/lib/openrouter";
import { appEnv } from "@/lib/env";

export type AIMessage = { role: "user" | "assistant" | "system"; content: string };
export type AIProvider = "OpenRouter";

const DEFAULT_MODEL = appEnv.openrouter.model || "inclusionai/ling-2.6-1t:free";

async function withTimeout<T>(
  task: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
  externalSignal?: AbortSignal,
) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  const onExternal = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener("abort", onExternal);
  }
  try {
    return await task(controller.signal);
  } finally {
    window.clearTimeout(timer);
    if (externalSignal) externalSignal.removeEventListener("abort", onExternal);
  }
}

/**
 * Stream a chat completion. Calls onDelta for every text token chunk as it arrives.
 * Returns the full concatenated text and which provider answered.
 */
export async function streamWebsiteAI(
  messages: AIMessage[],
  onDelta: (chunk: string, full: string) => void,
  options: { timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<{ content: string; provider: AIProvider }> {
  if (!hasOpenRouterConfig) {
    throw new Error("OpenRouter AI is not configured — check your VITE_OPENROUTER_API_KEY");
  }

  return withTimeout(async (signal) => {
    try {
      const client = getOpenRouterClient();
      const stream = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: messages as any,
        stream: true,
        temperature: 0.15,
        max_tokens: 4096,
      });

      let full = "";
      for await (const chunk of stream) {
        if (signal.aborted) break;
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) {
          full += delta;
          onDelta(delta, full);
        }
      }

      if (!full) throw new Error("AI returned empty stream");
      return { content: full, provider: "OpenRouter" as const };
    } catch (e: any) {
      throw new Error(explainOpenRouterError(e));
    }
  }, options.timeoutMs ?? 120_000, options.signal);
}

export async function completeWebsiteAI(
  messages: AIMessage[],
  options: { timeoutMs?: number } = {},
): Promise<{ content: string; provider: AIProvider }> {
  if (!hasOpenRouterConfig) {
    throw new Error("OpenRouter AI is not configured — check your VITE_OPENROUTER_API_KEY");
  }

  return withTimeout(async (signal) => {
    try {
      const client = getOpenRouterClient();
      const completion = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: messages as any,
        temperature: 0.15,
        max_tokens: 4096,
      });

      const content = completion.choices[0]?.message?.content || "";
      if (!content) throw new Error("AI returned empty content");
      return { content, provider: "OpenRouter" as const };
    } catch (error: any) {
      throw new Error(explainOpenRouterError(error));
    }
  }, options.timeoutMs ?? 90_000);
}

