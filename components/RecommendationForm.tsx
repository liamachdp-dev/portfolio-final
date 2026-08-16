"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function RecommendationForm() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/#recommendations`,
      },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const res = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error ?? "Something went wrong.");
      return;
    }

    setStatus("sent");
    setMessage("");
  }

  if (status === "sent") {
    return (
      <div className="border border-accent/30 bg-accentSoft rounded-lg px-5 py-4 text-sm text-accent font-mono">
        Thanks! Your recommendation is pending review — it'll show up here once approved.
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="inline-flex items-center gap-2 border border-line rounded-lg px-5 py-3 text-sm font-medium text-ink hover:border-accent transition-colors"
      >
        Sign in with Google to leave a recommendation
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 max-w-[56ch]">
      <div className="text-xs text-inkSoft font-mono">
        Signed in as {user.email} ·{" "}
        <button type="button" onClick={signOut} className="underline hover:text-accent">
          sign out
        </button>
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Say a few words..."
        maxLength={800}
        rows={4}
        required
        className="border border-line rounded-lg px-4 py-3 text-sm text-ink resize-none focus:outline-none focus:border-accent"
      />
      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
