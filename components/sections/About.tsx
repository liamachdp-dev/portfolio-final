export default function About() {
  return (
    <section id="about" className="min-h-[70vh] px-16 py-24 border-b border-line max-w-[860px]">
      <span className="block font-mono text-accent text-xs tracking-widest uppercase mb-3">01 — About</span>
      <h2 className="font-display font-semibold text-[clamp(28px,3vw,40px)] text-ink mb-4.5">
        Hi, I&apos;m [Your Name].
      </h2>
      <p className="text-inkSoft text-base leading-relaxed max-w-[56ch]">
        Write your real intro here — who you are, what you study, and what kind of work you&apos;re
        looking for. Keep it short; the boot sequence already did the flexing.
      </p>
    </section>
  );
}
