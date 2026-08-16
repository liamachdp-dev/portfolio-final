import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// PATCH /api/recommendations/:id  { status: "approved" | "rejected" }
// Only the signed-in ADMIN_EMAIL account can call this. It uses the
// service-role client to bypass RLS for the actual update, but only
// after verifying the caller's identity via the normal cookie-based
// session first.
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await request.json();
  const status = body?.status;

  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ error: "status must be 'approved' or 'rejected'." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("recommendations")
    .update({ status })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
