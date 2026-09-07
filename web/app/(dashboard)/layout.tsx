import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";
import type { Vehicle } from "@/lib/types";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row">
        <Sidebar vehicles={(vehicles || []) as Vehicle[]} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
