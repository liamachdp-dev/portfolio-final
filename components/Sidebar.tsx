"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About", num: "01" },
  { href: "#certifications", label: "Certifications", num: "02" },
  { href: "#projects", label: "Projects", num: "03" },
  { href: "#skills", label: "Skills", num: "04" },
  { href: "#recommendations", label: "Recommendations", num: "05" },
];

export default function Sidebar() {
  const [active, setActive] = useState("#about");

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="sticky top-0 h-screen w-[220px] flex-shrink-0 border-r border-line px-7 py-12 flex flex-col gap-9 font-mono">
      {/* Header */}
      <div className="font-display font-semibold text-[15px] text-ink">
        [Your Name]
        <span className="block text-[11px] text-inkSoft font-medium mt-0.5">Portfolio</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`flex items-center gap-2.5 text-sm px-2.5 py-2 rounded-md transition-colors ${
              active === l.href ? "bg-accentSoft text-accent" : "text-inkSoft hover:bg-accentSoft hover:text-accent"
            }`}
          >
            <span className="text-[11px] tabular-nums w-3.5">{l.num}</span>
            {l.label}
          </a>
        ))}
      </nav>

      {/* Pinned Bottom Group */}
      <div className="mt-auto flex flex-col gap-4">
        {/* Centered Action Boxes */}
        <div className="flex items-center justify-center gap-3 w-full">
          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            aria-label="LinkedIn"
            className="w-9 h-9 flex items-center justify-center rounded-md border border-line bg-white text-inkSoft hover:text-accent hover:border-accent hover:bg-accentSoft transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
            </svg>
          </a>

          {/* Email */}
          <a
            href="mailto:liamhadap.2@gmail.com"
            title="Email"
            aria-label="Email"
            className="w-9 h-9 flex items-center justify-center rounded-md border border-line bg-white text-inkSoft hover:text-accent hover:border-accent hover:bg-accentSoft transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.4 2 7.1 6.2a1 1 0 0 0 1.3 0L20 7" />
            </svg>
          </a>

          {/* Resume Download */}
          <a
            href="/resume.pdf"
            download
            title="Download resume"
            aria-label="Download resume"
            className="w-9 h-9 flex items-center justify-center rounded-md border border-line bg-white text-inkSoft hover:text-accent hover:border-accent hover:bg-accentSoft transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v11m0 0-4-4m4 4 4-4M5 19h14" />
            </svg>
          </a>
        </div>

        {/* Minigames Box */}
        <div className="border-2 border-dashed border-inkSoft/40 rounded-xl py-5 px-3 text-center text-[11px] font-medium text-inkSoft tracking-wide flex items-center justify-center">
          minigames coming soon
        </div>
      </div>
    </aside>
  );
}