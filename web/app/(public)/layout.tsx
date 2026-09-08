import PublicHeader from "@/components/PublicHeader";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <PublicHeader loggedIn={!!user} />
      {children}
    </div>
  );
}
