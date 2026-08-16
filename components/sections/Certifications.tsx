const certifications = [
  { name: "CompTIA Security+", status: "In progress", link: "#" },
  { name: "CEH (Certified Ethical Hacker)", status: "Planned", link: "#" },
];

export default function Certifications() {
  return (
    <section id="certifications" className="min-h-[70vh] px-16 py-24 border-b border-line max-w-[860px]">
      <span className="block font-mono text-accent text-xs tracking-widest uppercase mb-3">02 — Certifications</span>
      <h2 className="font-display font-semibold text-[clamp(28px,3vw,40px)] text-ink mb-6">Certifications</h2>
      <div className="flex flex-col gap-3">
        {certifications.map((cert) => (
          <a
            key={cert.name}
            href={cert.link}
            className="flex items-center justify-between border border-line rounded-lg px-5 py-4 hover:border-accent transition-colors"
          >
            <span className="text-ink font-medium">{cert.name}</span>
            <span className="text-inkSoft text-sm font-mono">{cert.status}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
