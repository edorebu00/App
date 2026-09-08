"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message === "Invalid login credentials" ? "Email o password non corretti." : error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
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
          <p className="mt-2 text-sm text-graphite-400">Il tuo parco auto e moto, curato come in vetrina.</p>
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
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? "Accesso in corso…" : "Accedi"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-graphite-400">
          Non hai un account?{" "}
          <Link href="/registrati" className="font-medium text-gold-500 hover:underline">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
}
