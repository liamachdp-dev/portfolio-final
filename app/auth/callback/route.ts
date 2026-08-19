import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recommendations")
    .select("id, name, affiliation, avatar_url, message, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recommendations: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must sign in with Google first." }, { status: 401 });
  }

  const body = await request.json();

  if (typeof body?.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = (body?.name ?? "").toString().trim();
  const affiliation = (body?.affiliation ?? "").toString().trim();
  const message = (body?.message ?? "").toString().trim();

  if (!name) {
    return NextResponse.json({ error: "Name can't be empty." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }
  if (message.length > 800) {
    return NextResponse.json({ error: "Keep it under 800 characters." }, { status: 400 });
  }
  if (affiliation.length > 120) {
    return NextResponse.json({ error: "Affiliation is too long." }, { status: 400 });
  }

  const { error } = await supabase.from("recommendations").insert({
    user_id: user.id,
    name,
    affiliation,
    avatar_url: user.user_metadata?.avatar_url ?? null,
    message,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You've already submitted a recommendation." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}