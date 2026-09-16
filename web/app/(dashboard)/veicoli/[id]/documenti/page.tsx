import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import FileUploader from "@/components/FileUploader";
import DocumentList from "@/components/DocumentList";
import ChatPanel from "@/components/ChatPanel";
import type { ChatMessage, DocumentRow, Vehicle } from "@/lib/types";

export default async function VehicleDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const t = await getTranslations("documentsPage");

  const { data: vehicle } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
  if (!vehicle) notFound();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("vehicle_id", id)
    .order("created_at", { ascending: false });

  const { data: messages } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("vehicle_id", id)
    .order("created_at", { ascending: true })
    .limit(50);

  const v = vehicle as Vehicle;

  return (
    <div>
      <Link
        href={`/veicoli/${v.id}`}
        className="mb-4 inline-block text-sm text-graphite-500 transition hover:text-graphite-900"
      >
        {t("backTo", { name: `${v.make} ${v.model}` })}
      </Link>

      <div className="hero-panel mb-8 px-6 py-8">
        <div className="relative z-10">
          <p className="eyebrow">{v.make} {v.model}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900">
            {t("title")}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4">
            <FileUploader vehicleId={v.id} />
          </div>
          <DocumentList documents={(documents || []) as DocumentRow[]} />
        </div>

        <div>
          <ChatPanel vehicleId={v.id} initialMessages={(messages || []) as ChatMessage[]} />
        </div>
      </div>
    </div>
  );
}
