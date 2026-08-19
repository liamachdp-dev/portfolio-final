"use client";

import { useEffect, useRef, useState } from "react";
import { asciiArt } from "@/lib/asciiArt";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const infoRows: { 
  type: "prompt" | "rule" | "field" | "section" | "swatches" | "socials"; 
  label?: string; 
  value?: string; 
  text?: string 
}[] = [
  { type: "prompt", text: "liam-hdp@portfolio" },
  { type: "rule", text: "-----------------------" },
  { type: "field", label: "Degree", value: "BS Information Technology (Network & Security)" },
  { type: "field", label: "School", value: "University of Santo Tomas" },
  
  { type: "section", text: "-- INTERESTS --" },
  { type: "field", value: "Vulnerability Assessment, Penetration Testing, Threat Defense, System Hardening, Cloud Security" },
  
  { type: "section", text: "-- TRY HACK ME --" },
  { type: "field", value: "Top 1%" },
  
  { type: "section", text: "-- CERTIFICATIONS --" },
  { type: "field", value: "ISC2, CompTia, [Pending] Azure, AWS" },

  { type: "section", text: "-- QUOTE --" },
  { type: "field", value: '"He who jumps into the void owes no explanation to those who stand by and watch"' },

  { type: "section", text: "-- SOCIALS --" },
  { type: "socials" },
  { type: "swatches" },
];

export default function Neofetch({ start }: { start: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [wrapShown, setWrapShown] = useState(false);
  const [tagShown, setTagShown] = useState(false);
  const [cueShown, setCueShown] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (!start || ran.current) return;
    ran.current = true;

    async function reveal() {
      setWrapShown(true);
      const steps = Math.max(asciiArt.length, infoRows.length);
      for (let i = 0; i < steps; i++) {
        setVisibleCount((c) => c + 1);
        await wait(30);
      }
      setTagShown(true);
      await wait(300);
      setCueShown(true);
    }
    reveal();
  }, [start]);

  return (
    <section id="neofetch" className="w-full max-w-full overflow-x-hidden px-4 sm:px-8 py-6">
      {/* flex-col stacks ASCII on top for mobile; md:flex-row preserves side-by-side desktop view */}
      <div className={`fetch-wrap ${wrapShown ? "show" : ""} flex flex-col md:flex-row items-start gap-6 md:gap-10 w-full max-w-full overflow-hidden`}>
        
        {/* ASCII Art Wrapper (Top on mobile) */}
        <div id="ascii-wrap" className="w-full md:w-auto max-w-full overflow-x-auto select-none">
          <div id="ascii" className="font-mono text-[10px] sm:text-xs md:text-sm">
            {asciiArt.map((line, i) => (
              <div key={i} className={`ascii-line ${i < visibleCount ? "show" : ""}`}>
                {line}
              </div>
            ))}
          </div>
          <div className={`ascii-tag ${tagShown ? "show" : ""}`}>
            {/* ↳ placeholder — swap lib/asciiArt.ts with your real portrait */}
          </div>
        </div>

        {/* Info Wrapper (Bottom on mobile) */}
        <div id="info" className="w-full md:flex-1 min-w-0">
          {infoRows.map((row, i) => {
            const shown = i < visibleCount ? "show" : "";
            
            if (row.type === "prompt") {
              return (
                <div key={i} className={`row ${shown}`}>
                  <span className="prompt">{row.text}</span>
                </div>
              );
            }
            if (row.type === "rule") {
              return (
                <div key={i} className={`row ${shown}`}>
                  <span className="rule">{row.text}</span>
                </div>
              );
            }
            if (row.type === "section") {
              return (
                <div key={i} className={`row ${shown} mt-3`}>
                  <span className="section-head">{row.text}</span>
                </div>
              );
            }
            if (row.type === "socials") {
              return (
                <div key={i} className={`row socials-row flex flex-wrap items-center gap-2.5 ${shown}`}>
                  {/* LinkedIn Button */}
                  <a 
                    href="https://www.linkedin.com/in/liam-hadap-81b66138b/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-box flex items-center justify-center" 
                    aria-label="LinkedIn" 
                    title="LinkedIn"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path
                        d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>

                  {/* Email Button */}
                  <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=liamhdp.alt@gmail.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-box flex items-center justify-center" 
                    aria-label="Email" 
                    title="Email"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path
                        d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.4 2 7.1 6.2a1 1 0 0 0 1.3 0L20 7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  
                  <span className="font-mono text-[11px] text-inkSoft/70 italic tracking-wide ml-1">
                    ➞ please fund my security+ huhuhu
                  </span>
                </div>
              );
            }
            if (row.type === "swatches") {
              return (
                <div key={i} className={`row swatches ${shown} mt-1`}>
                  <span style={{ background: "#4ade80" }} />
                  <span style={{ background: "#38bdf8" }} />
                  <span style={{ background: "#fbbf24" }} />
                  <span style={{ background: "#d7ffe0" }} />
                </div>
              );
            }

            return (
              <div key={i} className={`row ${shown}`}>
                {row.label ? (
                  <>
                    <span className="label">{row.label}</span>: <span className="val">{row.value}</span>
                  </>
                ) : (
                  <span className="val">{row.value}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div id="scroll-cue" className={cueShown ? "show" : ""}>
        <span>scroll to continue</span>
        <span className="arrow">↓</span>
      </div>
    </section>
  );
}