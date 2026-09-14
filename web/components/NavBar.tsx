import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
  return (
    <header className="border-b border-graphite-700/80 bg-graphite-900/85 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-[0.08em] text-white">
          <span className="grid h-8 w-8 place-items-center rounded bg-brand-600 text-base shadow-lg shadow-brand-900/50">M</span>
          <span><span className="text-brand-500">My</span>Vehicle</span>
        </Link>
        <LogoutButton />
      </div>
      <div className="flag-stripe" />
    </header>
  );
}
