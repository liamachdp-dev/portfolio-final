"use client";

import { useEffect, useRef, useState } from "react";
import { asciiArt } from "@/lib/asciiArt";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Edit these freely -- this is the content that appears on the right.
const infoRows: { type: "prompt" | "rule" | "field" | "section" | "swatches"; label?: string; value?: string; text?: string }[] = [
  { type: "prompt", text: "guest@yourname-portfolio" },
  { type: "rule", text: "-----------------------" },
  { type: "field", label: "Role", value: "NetSec & Cybersecurity Student" },
  { type: "field", label: "Location", value: "[City, Country]" },
  { type: "field", label: "Uptime", value: "[X] years in the field" },
  { type: "field", label: "Shell", value: "bash --curiosity" },
  { type: "section", text: "-- arsenal --" },
  { type: "field", label: "Tools", value: "Kali Linux, Wireshark, Burp Suite, Nmap, Metasploit" },
  { type: "section", text: "-- certs --" },
  { type: "field", label: "Certs", value: "CompTIA Security+ [status], CEH [status]" },
  { type: "section", text: "-- ctf --" },
  { type: "field", label: "CTF", value: "TryHackMe [rank/%], HackTheBox [rank]" },
  { type: "section", text: "-- projects --" },
  { type: "field", label: "Projects", value: "[X] active — see /projects below" },
  { type: "section", text: "-- writing --" },
  { type: "field", label: "Blog", value: 'latest: "[post title]"' },
  { type: "section", text: "-- socials --" },
  { type: "field", label: "Links", value: "GitHub · LinkedIn · TryHackMe" },
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
        await wait(55);
      }
      setTagShown(true);
      await wait(300);
      setCueShown(true);
    }
    reveal();
  }, [start]);

  return (
    <section id="neofetch">
      <div className={`fetch-wrap ${wrapShown ? "show" : ""}`}>
        <div id="ascii-wrap">
          <div id="ascii">
            {asciiArt.map((line, i) => (
              <div key={i} className={`ascii-line ${i < visibleCount ? "show" : ""}`}>
                {line}
              </div>
            ))}
          </div>
          <div className={`ascii-tag ${tagShown ? "show" : ""}`}>
            ↳ placeholder — swap lib/asciiArt.ts with your real portrait
          </div>
        </div>

        <div id="info">
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
                <div key={i} className={`row ${shown}`}>
                  <span className="section-head">{row.text}</span>
                </div>
              );
            }
            if (row.type === "swatches") {
              return (
                <div key={i} className={`row swatches ${shown}`}>
                  <span style={{ background: "#4ade80" }} />
                  <span style={{ background: "#38bdf8" }} />
                  <span style={{ background: "#fbbf24" }} />
                  <span style={{ background: "#d7ffe0" }} />
                </div>
              );
            }
            return (
              <div key={i} className={`row ${shown}`}>
                <span className="label">{row.label}</span>: <span className="val">{row.value}</span>
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
