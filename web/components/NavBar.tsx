import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-lg font-bold text-brand-700">
          My Vehicle
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
