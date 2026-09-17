import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Header di sicurezza applicati a tutte le risposte. Senza `frame-ancestors` la dashboard
 * (con la sessione dell'utente gia' attiva) puo' essere incorniciata da un sito terzo e usata
 * per clickjacking; gli altri header riducono MIME sniffing, perdita di Referer verso l'esterno
 * e accesso implicito a fotocamera/microfono/geolocalizzazione.
 * Nota: qui non c'e' una CSP completa (`script-src`) perche' Next inietta script inline e
 * servirebbe la propagazione di un nonce; `frame-ancestors` e' comunque valido da solo.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Il numero di versione di Next in chiaro serve solo a chi cerca bersagli con versioni note.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
