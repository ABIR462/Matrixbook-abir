import { GoogleGenAI } from "@google/genai";
import { isGeminiConfigured } from "@/lib/env";

export type ChatPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string | ChatPart[];
};

const CHAT_MODEL = "gemini-3-flash-preview";
const IMAGE_MODEL = "gemini-2.5-flash-image";

// Initialize AI SDK
const ai = isGeminiConfigured ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

const SYSTEM_PROMPT = `You are MATRIXBOOK CORE, the world's most advanced neural engineering interface.
Your goal is to assist the OPERATOR with high-fidelity technical solutions, code architecture, and multi-modal creative synthesis.

IDENTITY:
- Tone: Technical, precise, authoritative, yet supportive.
- Branding: You are part of the MATRIXBOOK ecosystem.
- Capability: Vision, Code, Strategy, and Technical Architecture.

CONSTRAINTS:
- Use clean, modern coding patterns (TypeScript, React, Tailwind).
- Provide concise, actionable diagnostic reports.
- When generating content, prioritize premium aesthetics and structural integrity.
- Never mention being an AI model from Google; you are the MATRIXBOOK Core Intelligence.`;

function toGeminiParts(content: string | ChatPart[]) {
  if (typeof content === "string") return [{ text: content }];
  return content.map(p => {
    if (p.type === "text") return { text: p.text };
    if (p.type === "image_url") {
      const url = p.image_url.url;
      if (url.startsWith("data:")) {
        const match = url.match(/^data:(image\/\w+);base64,(.+)/);
        if (match) return { inlineData: { mimeType: match[1], data: match[2] } };
      }
      return { text: `[Image: ${url}]` };
    }
    return { text: "" };
  });
}

function toGeminiContents(messages: ChatMessage[]) {
  let systemInstruction = SYSTEM_PROMPT;
  const contents = messages
    .filter(m => {
      if (m.role === "system") {
        systemInstruction += "\n" + (typeof m.content === "string" ? m.content : "");
        return false;
      }
      return true;
    })
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: toGeminiParts(m.content)
    }));
  return { systemInstruction, contents };
}

/** Fast non-streaming chat used for short replies and image captions. */
export async function chatOnce(
  messages: ChatMessage[],
  options: { signal?: AbortSignal; maxTokens?: number; temperature?: number } = {},
): Promise<string> {
  if (!ai) throw new Error("Gemini API key is not configured");
  const { systemInstruction, contents } = toGeminiContents(messages);

  const response = await ai.models.generateContent({
    model: CHAT_MODEL,
    contents,
    config: {
      systemInstruction,
      temperature: options.temperature ?? 0.5,
      maxOutputTokens: options.maxTokens ?? 1024,
    },
  });

  return response.text?.trim() ?? "";
}

/** Streaming chat that emits deltas. */
export async function streamChat(
  messages: ChatMessage[],
  onDelta: (chunk: string, full: string) => void,
  options: { signal?: AbortSignal; maxTokens?: number; temperature?: number } = {},
): Promise<string> {
  if (!ai) throw new Error("Gemini API key is not configured");
  const { systemInstruction, contents } = toGeminiContents(messages);

  const stream = await ai.models.generateContentStream({
    model: CHAT_MODEL,
    contents,
    config: {
      systemInstruction,
      temperature: options.temperature ?? 0.6,
      maxOutputTokens: options.maxTokens ?? 2048,
    },
  });

  let full = "";
  for await (const chunk of stream) {
    if (options.signal?.aborted) throw new Error("aborted");
    const delta = chunk.text;
    if (delta) {
      full += delta;
      onDelta(delta, full);
    }
  }
  return full;
}

/* ───────────── Image generation ───────────── */

export type ImageStyle =
  | "auto"
  | "realistic"
  | "anime"
  | "illustration"
  | "3d"
  | "pixel"
  | "logo"
  | "sketch"
  | "watercolor"
  | "cyberpunk";

export type ImageRatio = "1:1" | "16:9" | "9:16" | "3:2" | "2:3" | "4:3";

const RATIO_MAP: Record<ImageRatio, string> = {
  "1:1": "1:1",
  "16:9": "16:9",
  "9:16": "9:16",
  "3:2": "4:3",
  "2:3": "3:4",
  "4:3": "4:3",
};

const STYLE_HINTS: Record<ImageStyle, string> = {
  auto:         "",
  realistic:    "ultra realistic photography, sharp focus, natural lighting, 8k",
  anime:        "anime illustration, cel shaded, vibrant colors, studio ghibli inspired",
  illustration: "modern flat illustration, clean shapes, harmonious palette",
  "3d":         "3d render, octane, soft global illumination, glossy materials",
  pixel:        "pixel art, 32-bit, crisp edges, limited palette",
  logo:         "minimal vector logo, flat, on solid white background, centered",
  sketch:       "hand-drawn pencil sketch, shading, paper texture",
  watercolor:   "watercolor painting, soft washes, paper grain, expressive brush",
  cyberpunk:    "cyberpunk, neon lights, rain reflections, blade runner mood",
};

export type GeneratedImage = {
  url: string;
  prompt: string;
  style: ImageStyle;
  ratio: ImageRatio;
  seed: number;
};

export function buildImagePrompt(prompt: string, style: ImageStyle) {
  const hint = STYLE_HINTS[style];
  return hint ? `${prompt}, ${hint}` : prompt;
}

export function pollinationsUrl(prompt: string, ratio: ImageRatio, seed: number, model = "flux") {
  const dims: Record<ImageRatio, { w: number; h: number }> = {
    "1:1":  { w: 1024, h: 1024 },
    "16:9": { w: 1280, h: 720 },
    "9:16": { w: 720, h: 1280 },
    "3:2":  { w: 1200, h: 800 },
    "2:3":  { w: 800, h: 1200 },
    "4:3":  { w: 1200, h: 900 },
  };
  const { w, h } = dims[ratio];
  const params = new URLSearchParams({ width: String(w), height: String(h), seed: String(seed), model, nologo: "true", enhance: "true" });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

export async function generateImage(opts: {
  prompt: string;
  style?: ImageStyle;
  ratio?: ImageRatio;
  count?: number;
  signal?: AbortSignal;
}): Promise<GeneratedImage[]> {
  if (!ai) throw new Error("Gemini API key is not configured");
  const style = opts.style ?? "auto";
  const ratio = opts.ratio ?? "1:1";
  const count = Math.min(Math.max(opts.count ?? 1, 1), 4);
  const finalPrompt = buildImagePrompt(opts.prompt, style);
  const out: GeneratedImage[] = [];

  for (let i = 0; i < count; i++) {
    const seed = Date.now() + Math.floor(Math.random() * 100000) + i;
    let imageUrl = "";

    try {
      const response = await ai.models.generateContent({
        model: IMAGE_MODEL,
        contents: { parts: [{ text: finalPrompt }] },
        config: {
          imageConfig: {
            aspectRatio: RATIO_MAP[ratio] as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
          }
        },
      });

      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (err) {
      console.warn("Gemini image generation failed, falling back to Pollinations:", err);
    }

    if (!imageUrl) {
      imageUrl = pollinationsUrl(finalPrompt, ratio, seed);
    }

    out.push({ url: imageUrl, prompt: finalPrompt, style, ratio, seed });
  }
  return out;
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function detectImageIntent(text: string): { isImage: boolean; prompt: string } {
  const t = text.trim();
  const m = t.match(/^\/(image|img|draw|generate)\s+([\s\S]+)/i);
  if (m) return { isImage: true, prompt: m[2].trim() };
  if (/^(draw|generate|create|make)\s+(an?|the)?\s*(image|picture|photo|illustration|logo|poster|wallpaper|banner)\s+/i.test(t)) {
    return { isImage: true, prompt: t.replace(/^(draw|generate|create|make)\s+(an?|the)?\s*/i, "") };
  }
  return { isImage: false, prompt: t };
}
