import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Used inside server components, server actions, and route handlers.
// Reads/writes the auth session via cookies so `auth.uid()` works
// correctly with your RLS policies.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component -- middleware refreshes
            // the session instead, so this can be safely ignored.
          }
        },
      },
    }
  );
}

// Admin-only client using the service role key. This BYPASSES row
// level security entirely -- only ever import this inside server-only
// code (API routes / server actions), never in a client component,
// and always gate its use behind an admin email check first.
export function createAdminClient() {
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
