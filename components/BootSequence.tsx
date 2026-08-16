"use client";

import { useEffect, useRef, useState } from "react";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface Line {
  text: string;
  className: string;
}

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [hidden, setHidden] = useState(false);
  const flashRef = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    // Respect reduced-motion users -- skip straight to the reveal.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only play once per browser session.
    const alreadyBooted = sessionStorage.getItem("booted") === "true";

    if (prefersReduced || alreadyBooted) {
      setHidden(true);
      onDone();
      return;
    }

    if (ran.current) return;
    ran.current = true;

    async function typeDots(prefix: string, className: string) {
      setLines((prev) => [...prev, { text: prefix, className }]);
      for (let i = 0; i < 3; i++) {
        await wait(260);
        setLines((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            ...next[next.length - 1],
            text: next[next.length - 1].text + ".",
          };
          return next;
        });
      }
    }

    async function run() {
      await wait(300);
      await typeDots("booting up", "boot-ok");
      await wait(500);
      await typeDots("gathering information", "boot-ok");
      await wait(500);

      const okLines = [
        "loading modules ......... [OK]",
        "mounting filesystem ..... [OK]",
        "starting portfolio.service [OK]",
      ];
      for (const l of okLines) {
        setLines((prev) => [...prev, { text: l, className: "boot-dim" }]);
        await wait(280);
      }

      await wait(400);
      setLines((prev) => [...prev, { text: "booting up", className: "boot-count" }]);
      for (const n of ["   3", ".....2", ".....1"]) {
        await wait(500);
        setLines((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            ...next[next.length - 1],
            text: next[next.length - 1].text + n,
          };
          return next;
        });
      }

      await wait(500);
      flashRef.current?.classList.add("pop");
      await wait(200);
      setHidden(true);
      sessionStorage.setItem("booted", "true");
      onDone();
    }

    run();
  }, [onDone]);

  return (
    <>
      <div id="flash" ref={flashRef} />
      <div id="boot-overlay" className={hidden ? "hide" : ""}>
        <div id="boot-lines">
          {lines.map((l, i) => (
            <div key={i} className={l.className}>
              {l.text}
            </div>
          ))}
          <span className="boot-cursor" />
        </div>
      </div>
    </>
  );
}
