"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="hero-spotlight" />
        <div className="glass-panel relative z-10 max-w-sm p-6 text-center animate-rise-in">
          <p className="eyebrow-gold justify-center">Un ultimo passo</p>
          <h1 className="mt-3 text-xl font-semibold text-white">Controlla la tua email</h1>
          <p className="mt-2 text-sm text-graphite-300">
            Ti abbiamo inviato un link di conferma a <strong>{email}</strong>. Apri il link per attivare
            l&apos;account, poi torna qui per accedere.
          </p>
          <Link href="/login" className="btn-primary mt-4 inline-flex">
            Vai al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="hero-spotlight" />

      <div className="relative z-10 w-full max-w-sm animate-rise-in">
        <div className="mb-8 text-center">
          <p className="eyebrow-gold justify-center">Garage digitale</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white">
            MY <span className="text-brand-500">VEHICLE</span>
          </h1>
          <p className="mt-2 text-sm text-graphite-400">Crea il tuo account e inizia a curare la tua collezione.</p>
          <div className="flag-stripe mx-auto mt-5 w-20 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="glass-panel space-y-4 p-6">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-graphite-500">Almeno 6 caratteri.</p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? "Creazione account…" : "Registrati"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-graphite-400">
          Hai già un account?{" "}
          <Link href="/login" className="font-medium text-gold-500 hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
