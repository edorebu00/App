import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
  return (
    <header className="border-b border-graphite-700 bg-graphite-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-wide text-white">
          <span className="text-brand-600">My</span>Vehicle
        </Link>
        <LogoutButton />
      </div>
      <div className="flag-stripe" />
    </header>
  );
}
