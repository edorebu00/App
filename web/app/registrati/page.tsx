"use client";

import Link from "next/link";
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

export default function RegisterPage() {
  const supabase = createClient();
  const t = useTranslations("auth");
  const tBrand = useTranslations("brand");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    setLoading(true);

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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-graphite-50 px-4">
      <div className="animate-drift pointer-events-none absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-500/15 blur-3xl" />

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="glass-panel relative z-10 max-w-sm text-center"
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 18 }}
              className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-2xl"
            >
              ✉️
            </motion.span>
            <p className="eyebrow mt-4 justify-center">{t("confirmEmailEyebrow")}</p>
            <h1 className="mt-2 text-xl font-semibold text-graphite-900">{t("confirmEmailTitle")}</h1>
            <p className="mt-2 text-sm text-graphite-600">
              {t.rich("confirmEmailText", { email, b: (chunks) => <strong>{chunks}</strong> })}
            </p>
            <Link href="/login" className="btn-primary mt-4 inline-flex">
              {t("goToLogin")}
            </Link>
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
                {t("registerTagline")}
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
                  minLength={6}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="mt-1 text-xs text-graphite-400">{t("minChars")}</p>
              </div>
              <div>
                <label className="label" htmlFor="confirmPassword">{t("confirmPasswordLabel")}</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? t("registerSubmitLoading") : t("registerSubmit")}
              </button>
            </motion.form>

            <motion.p variants={itemVariants} className="mt-5 text-center text-sm text-graphite-500">
              {t("hasAccount")}{" "}
              <Link href="/login" className="font-medium text-brand-600 hover:underline">
                {t("loginLink")}
              </Link>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
