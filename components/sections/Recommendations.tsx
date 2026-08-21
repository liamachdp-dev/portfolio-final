import RecommendationForm from "@/components/RecommendationForm";
import { createClient } from "@/lib/supabase/server";
import type { Recommendation } from "@/lib/types";

export default async function Recommendations() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recommendations")
    .select("id, name, affiliation, message, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const approved = (data ?? []) as Pick<Recommendation, "id" | "name" | "affiliation" | "message" | "created_at">[];

  return (
    <section id="recommendations" className="px-6 sm:px-12 md:px-16 py-12 md:py-24 w-full max-w-[1100px]">
      <span className="block font-mono text-accent text-xs tracking-widest  mb-3">06 — Recommendations</span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-[clamp(28px,3vw,40px)] text-ink mb-10">What people say</h2>

      <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-stretch">
        {/* Form Container */}
        <div className="w-full md:w-[300px] flex-shrink-0 border-b md:border-b-0 border-line pb-8 md:pb-0">
          <RecommendationForm />
        </div>

        {/* Vertical Divider (Desktop Only) */}
        <div className="hidden md:block w-px bg-line self-stretch" />

        {/* Recommendations List */}
        <div className="flex-1 min-w-0">
          {approved.length === 0 ? (
            <p className="text-inkSoft text-sm">No recommendations yet — be the first.</p>
          ) : (
            <div className="flex flex-col gap-4 sm:gap-5">
              {approved.map((rec) => (
                <div key={rec.id} className="border border-line rounded-lg p-4 sm:px-5 sm:py-4 bg-white">
                  <p className="text-ink text-xs sm:text-sm leading-relaxed">&ldquo;{rec.message}&rdquo;</p>
                  <span className="text-inkSoft text-[11px] sm:text-xs font-mono mt-2 block">
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