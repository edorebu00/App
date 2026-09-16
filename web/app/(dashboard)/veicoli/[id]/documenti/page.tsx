import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FileUploader from "@/components/FileUploader";
import DocumentList from "@/components/DocumentList";
import ChatPanel from "@/components/ChatPanel";
import type { ChatMessage, DocumentRow, Vehicle } from "@/lib/types";

export default async function VehicleDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

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
        className="mb-4 inline-block text-sm text-graphite-400 transition hover:text-white"
      >
        ← Torna a {v.make} {v.model}
      </Link>

      <div className="relative mb-8 overflow-hidden rounded-xl border border-graphite-800 bg-graphite-800/40 px-6 py-8">
        <div className="hero-spotlight" />
        <div className="relative z-10">
          <p className="eyebrow-gold">{v.make} {v.model}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
            Documenti e assistente IA
          </h1>
          <div className="flag-stripe mt-4 w-16 rounded-full" />
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
