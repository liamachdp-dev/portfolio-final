import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { verifyAction } from "@/lib/approvalToken";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const token = searchParams.get("token");
  const id = params.id;

  if (!status || !token || (status !== "approved" && status !== "rejected")) {
    return new NextResponse("Invalid parameters", { status: 400 });
  }

  const isValid = verifyAction(id, status, token);
  if (!isValid) {
    return new NextResponse("Invalid or expired token. Unauthorized.", { status: 403 });
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from("recommendations")
    .update({ status })
    .eq("id", id);

  if (error) {
    return new NextResponse(`Database error: ${error.message}`, { status: 500 });
  }

  return new NextResponse(
    `<html>
      <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f9fafb;">
        <div style="text-align: center; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
          <h2 style="color: ${status === "approved" ? "#2f5d50" : "#374151"}; margin-top: 0;">
            Recommendation ${status === "approved" ? "Approved! ✅" : "Rejected ❌"}
          </h2>
          <p style="color: #6b7280; margin-bottom: 0;">The database has been updated. You can close this tab.</p>
        </div>
      </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}