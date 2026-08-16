import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: public list of approved recommendations (used by the
// Recommendations section on the homepage).
export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("recommendations")
    .select("id, name, avatar_url, message, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recommendations: data });
}

// POST: a signed-in visitor submits a recommendation. RLS enforces
// that they can only insert a row for themselves, with status
// forced to 'pending' -- they cannot self-approve.
export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must sign in with Google first." }, { status: 401 });
  }

  const body = await request.json();
  const message = (body?.message ?? "").toString().trim();

  if (!message) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }
  if (message.length > 800) {
    return NextResponse.json({ error: "Keep it under 800 characters." }, { status: 400 });
  }

  const { error } = await supabase.from("recommendations").insert({
    user_id: user.id,
    name: user.user_metadata?.full_name ?? user.email ?? "Anonymous",
    avatar_url: user.user_metadata?.avatar_url ?? null,
    message,
    status: "pending",
  });

  if (error) {
    // Unique-violation code -> they already submitted one.
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
