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
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="card max-w-sm text-center">
          <h1 className="mb-2 text-xl font-semibold text-brand-400">Controlla la tua email</h1>
          <p className="text-sm text-graphite-300">
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center text-2xl font-bold text-brand-400">My Vehicle</h1>
        <p className="mb-6 text-center text-sm text-graphite-400">Crea il tuo account</p>

        <form onSubmit={handleSubmit} className="card space-y-4">
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

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creazione account…" : "Registrati"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-graphite-400">
          Hai già un account?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
