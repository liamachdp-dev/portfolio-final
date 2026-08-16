"use client";

import { useState } from "react";

interface Cert {
  title: string;
  issuer: string;
  letter: string;
  iconBg: string;
  iconColor: string;
}

interface CertCategory {
  label: string;
  items: Cert[];
}

// Placeholder data -- swap titles/issuers for your real certifications.
// `letter` + colors stand in for a logo until you add real icon images.
const categories: CertCategory[] = [
  {
    label: "",
    items: [
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "G", iconBg: "bg-blue-50", iconColor: "text-blue-500" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "G", iconBg: "bg-blue-50", iconColor: "text-blue-500" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "O", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "N", iconBg: "bg-slate-50", iconColor: "text-slate-600" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "M", iconBg: "bg-green-50", iconColor: "text-green-600" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "S", iconBg: "bg-purple-50", iconColor: "text-purple-500" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "A", iconBg: "bg-red-50", iconColor: "text-red-500" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "C", iconBg: "bg-cyan-50", iconColor: "text-cyan-600" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "K", iconBg: "bg-blue-50", iconColor: "text-blue-500" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "P", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "W", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
      { title: "[Certification Name]", issuer: "PROVIDER", letter: "H", iconBg: "bg-rose-50", iconColor: "text-rose-500" },
    ],
  },
];

const ROTATIONS = [-2, 1.5, -1, 2.5, -3, 2, -1.5, 3, -2.5, 1, -2, 2];
const INITIAL_VISIBLE = 4;
const LOAD_STEP = 4;
const MAX_LOADS = 4; // "load 4 more" can be clicked at most this many times

function CertCard({ cert, index }: { cert: Cert; index: number }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      className="group relative bg-white rounded-xl border border-line px-5 py-6 transition-all duration-300 ease-out hover:z-10 hover:scale-110 hover:rotate-0 hover:border-accent hover:bg-accentSoft"
      style={{
        transform: `rotate(${rotation}deg)`,
        boxShadow: "0 10px 20px -10px rgba(24,27,23,0.12)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 0 1px rgba(47,93,80,0.3), 0 20px 40px -12px rgba(47,93,80,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 20px -10px rgba(24,27,23,0.12)";
      }}
    >
      <div className={`w-10 h-10 rounded-lg ${cert.iconBg} flex items-center justify-center mb-4`}>
        <span className={`text-base font-bold ${cert.iconColor}`}>{cert.letter}</span>
      </div>

      <h3 className="text-ink font-display font-semibold text-sm leading-snug mb-1">{cert.title}</h3>
      <span className="block font-mono text-[10px] tracking-widest text-inkSoft uppercase mb-6">
        {cert.issuer}
      </span>

      <button
        type="button"
        className="font-mono text-[10px] tracking-widest text-inkSoft uppercase group-hover:text-accent transition-colors"
        disabled
        title="Verification link coming soon"
      >
        ‹ VERIFY ›
      </button>
    </div>
  );
}

function CategorySection({ category }: { category: CertCategory }) {
  const [loadsUsed, setLoadsUsed] = useState(0);
  const visibleCount = Math.min(INITIAL_VISIBLE + loadsUsed * LOAD_STEP, category.items.length);
  const visible = category.items.slice(0, visibleCount);
  const canLoadMore = loadsUsed < MAX_LOADS && visibleCount < category.items.length;

  return (
    <div className="mb-14">
      <span className="block font-mono text-xs tracking-widest text-inkSoft uppercase mb-6">
        {category.label}
      </span>
      <div className="grid grid-cols-4 gap-1.5">
        {visible.map((cert, i) => (
          <CertCard key={i} cert={cert} index={i} />
        ))}
      </div>
      {canLoadMore && (
        <button
          onClick={() => setLoadsUsed((n) => n + 1)}
          className="mt-10 font-mono text-xs tracking-widest text-inkSoft uppercase border border-line rounded-full px-5 py-2.5 hover:border-accent hover:text-accent transition-colors"
        >
          Load 4 more
        </button>
      )}
    </div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="min-h-[70vh] px-16 py-24 border-b border-line max-w-[1100px]">
      <span className="block font-mono text-accent text-xs tracking-widest uppercase mb-3">02 — Certifications</span>
      <h2 className="font-display font-semibold text-[clamp(28px,3vw,40px)] text-ink mb-10">Certifications</h2>

      {categories.map((category) => (
        <CategorySection key={category.label} category={category} />
      ))}
    </section>
  );
}