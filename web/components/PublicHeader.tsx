import Link from "next/link";

export default function PublicHeader({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-graphite-800/80 bg-graphite-900/75 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-[0.08em] text-white"
        >
          <span className="grid h-8 w-8 place-items-center rounded bg-brand-600 text-base shadow-lg shadow-brand-900/50">M</span>
          <span><span className="text-brand-500">My</span>Vehicle</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-graphite-300 sm:flex">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/circuiti" className="transition hover:text-white">
            Circuiti
          </Link>
        </nav>
        {loggedIn ? (
          <Link href="/dashboard" className="btn-primary">
            Il mio garage
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-graphite-300 transition hover:text-white">
              Accedi
            </Link>
            <Link href="/registrati" className="btn-primary">
              Registrati
            </Link>
          </div>
        )}
      </div>
      <div className="flag-stripe" />
    </header>
  );
}
