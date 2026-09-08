import Link from "next/link";

export default function PublicHeader({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-graphite-800 bg-graphite-900/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-wide text-white"
        >
          <span className="text-brand-600">My</span>Vehicle
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
