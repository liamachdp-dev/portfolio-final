"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About", num: "01" },
  { href: "#certifications", label: "Certifications", num: "02" },
  { href: "#blogs", label: "Blogs", num: "03" },
  { href: "#courses", label: "Courses", num: "04" },
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
      <div className="font-display font-semibold text-[15px] text-ink">
        [Your Name]
        <span className="block text-[11px] text-inkSoft font-medium mt-0.5">Portfolio</span>
      </div>
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
    </aside>
  );
}
