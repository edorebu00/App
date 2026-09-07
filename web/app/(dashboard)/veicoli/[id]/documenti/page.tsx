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
      <Link href={`/veicoli/${v.id}`} className="mb-4 inline-block text-sm text-slate-500 hover:underline">
        ← Torna a {v.make} {v.model}
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Documenti e assistente IA</h1>

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
