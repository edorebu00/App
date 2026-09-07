import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error("ANTHROPIC_API_KEY deve essere impostata.");
}

export const anthropic = new Anthropic({ apiKey });

export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";
