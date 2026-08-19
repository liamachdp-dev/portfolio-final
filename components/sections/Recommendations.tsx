import RecommendationForm from "@/components/RecommendationForm";
import { createClient } from "@/lib/supabase/server";
import type { Recommendation } from "@/lib/types";

export default async function Recommendations() {
  const supabase = createClient();
  const { data } = await supabase
    .from("recommendations")
    .select("id, name, affiliation, message, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const approved = (data ?? []) as Pick<Recommendation, "id" | "name" | "affiliation" | "message" | "created_at">[];

  return (
    <section id="recommendations" className="px-16 py-24 max-w-[1100px]">
      <span className="block font-mono text-accent text-xs tracking-widest uppercase mb-3">05 — Recommendations</span>
      <h2 className="font-display font-semibold text-[clamp(28px,3vw,40px)] text-ink mb-10">What people say</h2>

      <div className="flex flex-col md:flex-row gap-0 md:gap-10 items-stretch">
        <div className="w-full md:w-[300px] flex-shrink-0">
          <RecommendationForm />
        </div>

        <div className="hidden md:block w-px bg-line self-stretch" />

        <div className="flex-1 min-w-0 mt-8 md:mt-0">
          {approved.length === 0 ? (
            <p className="text-inkSoft text-sm">No recommendations yet — be the first.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {approved.map((rec) => (
                <div key={rec.id} className="border border-line rounded-lg px-5 py-4">
                  <p className="text-ink text-sm leading-relaxed">&ldquo;{rec.message}&rdquo;</p>
                  <span className="text-inkSoft text-xs font-mono mt-2 block">
                    — {rec.name}{rec.affiliation ? `, ${rec.affiliation}` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}