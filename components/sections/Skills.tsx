"use client";

import { useState } from "react";

interface Category {
  label: string;
  items?: string[];
  frontend?: string[];
  backend?: string[];
  tools?: string[];
}

const categories: Category[] = [
  {
    label: "Languages",
    frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Tailwind CSS"],
    backend: ["Python", "PHP", "SQL", "Java"],
  },
  {
    label: "Cybersecurity",
    items: [
      "Vulnerability Assessment",
      "Penetration Testing",
      "Incident Response",
      "Auditing",
      "OSINT"
    ],
    tools: ["Kali Linux", "Parrot OS", "Wireshark", "Burp Suite"],
  },
  {
    label: "Networking",
    items: [
      "Cisco Packet Tracer",
      "Microsoft AD DS",
      "DNS",
      "DHCP",
      "Routing",
      "Switching",
      "Firewalls & VPNs",
      "Subnetting",
      "VLANs",
      "Network Security",
    ],
  },
];

export default function Skills() {
  const [active, setActive] = useState(0);
  const currentCat = categories[active];

  return (
    <section id="skills" className="px-6 sm:px-12 md:px-16 py-12 md:py-14 border-b border-line w-full max-w-[1100px]">
      <span className="block font-mono text-accent text-xs tracking-widest mb-3">
        04 — Skills
      </span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-[clamp(28px,3vw,40px)] text-ink mb-10">
        What I work with
      </h2>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => setActive(i)}
            className={`font-mono text-xs tracking-widest px-3 py-2 sm:px-4 sm:py-2.5 uppercase rounded-lg border transition-colors duration-200 cursor-pointer ${
              active === i
                ? "border-ink text-ink bg-white"
                : "border-transparent text-inkSoft hover:border-line"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div key={active} className="skills-fade-in">
        {currentCat.frontend && currentCat.backend && (
          <div className="flex flex-col gap-8">
            <div>
              <span className="block font-mono text-[11px] text-accent tracking-wider mb-3">
                // Frontend
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {currentCat.frontend.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs sm:text-sm text-ink bg-white border border-line rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 transition-colors duration-200 hover:border-inkSoft"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="block font-mono text-[11px] text-accent tracking-wider mb-3">
                // Backend
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {currentCat.backend.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs sm:text-sm text-ink bg-white border border-line rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 transition-colors duration-200 hover:border-inkSoft"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentCat.items && (
          <div className="flex flex-col gap-8">
            <div>
              {currentCat.tools && (
                <span className="block font-mono text-[11px] text-accent tracking-wider mb-3">
                  // Core Competencies
                </span>
              )}
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {currentCat.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs sm:text-sm text-ink bg-white border border-line rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 transition-colors duration-200 hover:border-inkSoft"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {currentCat.tools && (
              <div>
                <span className="block font-mono text-[11px] text-accent tracking-wider mb-3">
                  // Tools & Software
                </span>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {currentCat.tools.map((tool) => (
                    <span
                      key={tool}
                      className="font-mono text-xs sm:text-sm text-ink bg-white border border-line rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 transition-colors duration-200 hover:border-inkSoft"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}