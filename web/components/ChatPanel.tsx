"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { ChatMessage } from "@/lib/types";

export default function ChatPanel({
  vehicleId,
  initialMessages,
}: {
  vehicleId: string;
  initialMessages: ChatMessage[];
}) {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    // Il pulsante e' disabilitato mentre `loading` e' vero, ma la funzione si difende anche da
    // sola contro un doppio invio.
    if (loading) return;
    const text = input.trim();
    if (!text) return;

    const pendingId = `tmp-${Date.now()}`;

    setInput("");
    setError(null);
    setMessages((prev) => [
      ...prev,
      { id: pendingId, user_id: "", vehicle_id: vehicleId, role: "user", content: text, created_at: new Date().toISOString() },
    ]);
    setLoading(true);

    // Quando il server non ha registrato il messaggio la bolla va tolta, altrimenti sparirebbe da
    // sola al primo aggiornamento della pagina, e il testo va rimesso nel campo invece di
    // costringere a riscriverlo. Non vale pero' per ogni errore: la route scrive la riga prima di
    // chiamare il modello, quindi se dichiara di averla salvata la bolla resta dov'e', altrimenti
    // ricomparirebbe al ricaricamento e un reinvio ne lascerebbe due in cronologia.
    const restoreUnsent = () => {
      setMessages((prev) => prev.filter((m) => m.id !== pendingId));
      setInput((current) => current || text);
    };

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, message: text, locale }),
      });
      // Un timeout o un errore della piattaforma (502/504) risponde con una pagina non JSON: il
      // server pero' ha ricevuto la richiesta e la riga dell'utente puo' essere gia' salvata,
      // quindi in quel caso la bolla resta al suo posto. Diverso e' il caso di una richiesta
      // reindirizzata (sessione scaduta, rimandata a /login) o di una risposta riuscita ma non
      // JSON: la route risponde sempre in JSON, quindi la richiesta non l'ha raggiunta e nulla e'
      // stato salvato; la bolla va tolta e il testo rimesso nel campo.
      const data = await res.json().catch(() => null);

      if (res.redirected || (res.ok && data === null)) {
        setError(t("errorGeneric"));
        restoreUnsent();
      } else if (!res.ok) {
        setError(data?.error || t("errorGeneric"));
        if (data !== null && !data.userMessageSaved) restoreUnsent();
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
      setError(t("errorContact"));
      restoreUnsent();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex h-[520px] flex-col">
      <p className="eyebrow mb-3">{t("title")}</p>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-graphite-500">
            {t("empty")}
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-gradient-to-b from-brand-500 to-brand-400 text-graphite-50"
                  : "border border-graphite-200 bg-graphite-50 text-graphite-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <p className="flex items-center gap-2 text-sm text-graphite-500">
            <span className="spinner text-brand-600" aria-hidden />
            {t("thinking")}
          </p>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSend} className="mt-3 flex gap-2 border-t border-graphite-200 pt-3">
        <input
          className="input"
          placeholder={t("placeholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {t("send")}
        </button>
      </form>
    </div>
  );
}
