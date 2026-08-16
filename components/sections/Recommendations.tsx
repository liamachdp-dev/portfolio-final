import RecommendationForm from "@/components/RecommendationForm";
import { createClient } from "@/lib/supabase/server";
import type { Recommendation } from "@/lib/types";

export default async function Recommendations() {
  const supabase = createClient();
  const { data } = await supabase
    .from("recommendations")
    .select("id, name, avatar_url, message, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const approved = (data ?? []) as Pick<Recommendation, "id" | "name" | "avatar_url" | "message" | "created_at">[];

  return (
    <section id="recommendations" className="min-h-[70vh] px-16 py-24 border-b border-line max-w-[860px]">
      <span className="block font-mono text-accent text-xs tracking-widest uppercase mb-3">05 — Recommendations</span>
      <h2 className="font-display font-semibold text-[clamp(28px,3vw,40px)] text-ink mb-6">What people say</h2>

      <div className="mb-10">
        <RecommendationForm />
      </div>

      {approved.length === 0 ? (
        <p className="text-inkSoft text-sm">No recommendations yet — be the first.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {approved.map((rec) => (
            <div key={rec.id} className="border border-line rounded-lg px-5 py-4">
              <p className="text-ink text-sm leading-relaxed">&ldquo;{rec.message}&rdquo;</p>
              <span className="text-inkSoft text-xs font-mono mt-2 block">— {rec.name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
