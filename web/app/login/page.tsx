"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      setError(error.message === "Invalid login credentials" ? "Email o password non corretti." : error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 600);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-graphite-50 px-4">
      <div className="animate-drift pointer-events-none absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-100/70 blur-3xl" />

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="glass-panel relative z-10 flex flex-col items-center gap-2 text-center"
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 18 }}
              className="grid h-12 w-12 place-items-center rounded-full bg-green-100 text-2xl text-green-700"
            >
              ✓
            </motion.span>
            <p className="mt-1 text-sm font-medium text-graphite-600">Accesso effettuato, ti portiamo al garage…</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="relative z-10 w-full max-w-sm"
          >
            <div className="mb-8 text-center">
              <motion.p variants={itemVariants} className="eyebrow justify-center">
                Garage digitale
              </motion.p>
              <motion.h1 variants={itemVariants} className="mt-3 font-display text-3xl font-bold tracking-tight text-graphite-900">
                My<span className="text-brand-600">Vehicle</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="mt-2 text-sm text-graphite-500">
                Il tuo parco auto e moto, sempre sotto controllo.
              </motion.p>
            </div>

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="glass-panel space-y-4">
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

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? "Accesso in corso…" : "Accedi"}
              </button>
            </motion.form>

            <motion.p variants={itemVariants} className="mt-5 text-center text-sm text-graphite-500">
              Non hai un account?{" "}
              <Link href="/registrati" className="font-medium text-brand-600 hover:underline">
                Registrati
              </Link>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
