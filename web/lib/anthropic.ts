import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient() {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY deve essere impostata.");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";
