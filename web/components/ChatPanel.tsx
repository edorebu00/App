"use client";

import { useState } from "react";
import type { ChatMessage } from "@/lib/types";

export default function ChatPanel({
  vehicleId,
  initialMessages,
}: {
  vehicleId: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setInput("");
    setError(null);
    setMessages((prev) => [
      ...prev,
      { id: `tmp-${Date.now()}`, user_id: "", vehicle_id: vehicleId, role: "user", content: text, created_at: new Date().toISOString() },
    ]);
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, message: text }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore durante la risposta dell'assistente.");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `tmp-${Date.now()}-a`,
            user_id: "",
            vehicle_id: vehicleId,
            role: "assistant",
            content: data.reply,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setError("Impossibile contattare l'assistente. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex h-[520px] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400">
            Fai una domanda sul tuo veicolo: l&apos;assistente risponderà usando i documenti caricati.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-slate-400">L&apos;assistente sta scrivendo…</p>}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSend} className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
        <input
          className="input"
          placeholder="Scrivi una domanda…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          Invia
        </button>
      </form>
    </div>
  );
}
