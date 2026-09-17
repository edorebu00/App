"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("auth");
  const tBrand = useTranslations("brand");
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
      setError(error.message === "Invalid login credentials" ? t("invalidCredentials") : error.message);
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
      <div className="animate-drift pointer-events-none absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-500/15 blur-3xl" />

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
              className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/15 text-2xl text-emerald-400"
            >
              ✓
            </motion.span>
            <p className="mt-1 text-sm font-medium text-graphite-600">{t("loginSuccess")}</p>
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
                {tBrand("eyebrow")}
              </motion.p>
              <motion.h1 variants={itemVariants} className="mt-3 font-display text-3xl font-bold tracking-tight text-graphite-900">
                My<span className="text-brand-600">Vehicle</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="mt-2 text-sm text-graphite-500">
                {t("tagline")}
              </motion.p>
            </div>

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="glass-panel space-y-4">
              <div>
                <label className="label" htmlFor="email">{t("emailLabel")}</label>
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
                <label className="label" htmlFor="password">{t("passwordLabel")}</label>
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
                {loading ? t("loginSubmitLoading") : t("loginSubmit")}
              </button>
            </motion.form>

            <motion.p variants={itemVariants} className="mt-5 text-center text-sm text-graphite-500">
              {t("noAccount")}{" "}
              <Link href="/registrati" className="font-medium text-brand-600 hover:underline">
                {t("registerLink")}
              </Link>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
