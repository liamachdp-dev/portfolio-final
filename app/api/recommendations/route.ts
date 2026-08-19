import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { sendAdminEmail } from "@/lib/email";
import { signAction } from "@/lib/approvalToken";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recommendations")
    .select("id, name, affiliation, message, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recommendations: data });
}

export async function POST(request: Request) {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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

  const { data, error } = await supabaseAdmin
    .from("recommendations")
    .insert({ name, affiliation, message, status: "pending" })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const approveUrl = `${siteUrl}/api/recommendations/${data.id}?status=approved&token=${signAction(data.id, "approved")}`;
    const rejectUrl = `${siteUrl}/api/recommendations/${data.id}?status=rejected&token=${signAction(data.id, "rejected")}`;

    await sendAdminEmail({
      subject: `New recommendation from ${name}`,
      html: `
        <div style="font-family:sans-serif; max-width:520px;">
          <h2>New recommendation pending review</h2>
          <p><strong>From:</strong> ${name}${affiliation ? ` (${affiliation})` : ""}</p>
          <p style="white-space:pre-wrap; border-left:3px solid #2f5d50; padding-left:12px; color:#333;">${message}</p>
          <p style="margin-top:24px;">
            <a href="${approveUrl}" style="background:#2f5d50;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;margin-right:10px;">Approve</a>
            <a href="${rejectUrl}" style="background:#eee;color:#333;padding:10px 18px;border-radius:6px;text-decoration:none;">Reject</a>
          </p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Failed to send admin notification email:", e);
  }

  return NextResponse.json({ ok: true });
}