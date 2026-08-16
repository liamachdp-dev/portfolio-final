import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import AdminList from "./AdminList";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/callback?next=/admin`); // will bounce to sign-in flow if you wire one up
  }
  if (user?.email !== process.env.ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-sm text-ink">
        Not authorized.
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: pending } = await admin
    .from("recommendations")
    .select("id, name, avatar_url, message, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-paper px-10 py-14 font-sans">
      <h1 className="font-display text-2xl font-semibold text-ink mb-8">Pending recommendations</h1>
      <AdminList items={pending ?? []} />
    </div>
  );
}
