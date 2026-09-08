import "server-only";
import OpenAI from "openai";

let client: OpenAI | null = null;

/** true se è stata configurata una chiave OpenAI: se manca, il fallback viene saltato invece di rompersi. */
export function hasOpenAIFallback() {
  return !!process.env.OPENAI_API_KEY;
}

export function getOpenAIClient() {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY deve essere impostata.");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1";
export const OPENAI_SEARCH_MODEL = process.env.OPENAI_SEARCH_MODEL || "gpt-4o";
