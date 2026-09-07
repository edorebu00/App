import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  const { documentId } = await request.json();

  const agentRes = await fetch(`${process.env.AGENT_SERVICE_URL}/api/documents/${documentId}/process`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const data = await agentRes.json();
  return NextResponse.json(data, { status: agentRes.status });
}
