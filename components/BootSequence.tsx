"use client";

import { useEffect, useRef, useState } from "react";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Updated interface to separate the prompt from the text so we can color them differently
interface Line {
  id: string;
  type: "command" | "output";
  userHost?: string;
  path?: string;
  text: string;
}

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [hidden, setHidden] = useState(false);
  const flashRef = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyBooted = sessionStorage.getItem("booted") === "true";

    if (prefersReduced || alreadyBooted) {
      setHidden(true);
      onDone();
      return;
    }

    if (ran.current) return;
    ran.current = true;

    // Helper to simulate typing character by character
    async function typeCommand(userHost: string, path: string, command: string) {
      const id = Math.random().toString();
      
      // 1. Output the colored prompt
      setLines((prev) => [...prev, { id, type: "command", userHost, path, text: "" }]);
      await wait(400); 

      // 2. Type the command
      for (let i = 0; i < command.length; i++) {
        await wait(Math.random() * 60 + 40); 
        setLines((prev) => {
          const next = [...prev];
          const last = { ...next[next.length - 1] };
          last.text += command[i];
          next[next.length - 1] = last;
          return next;
        });
      }
      
      // 3. Pause slightly before "pressing enter"
      await wait(300); 
    }

    async function run() {
      // User/Host (Purple) and Path (Blue)
      const userHost = "guest@liam-hdp";
      const path1 = ":~$";
      const path2 = ":~/portfolio$";

      await wait(500);

      // --- COMMAND 1: ls ---
      await typeCommand(userHost, path1, "ls");
      setLines((prev) => [
        ...prev, 
        { id: "out1", type: "output", text: "about.txt   projects/   contact.sh   portfolio/" }
      ]);
      await wait(500);

      // --- COMMAND 2: cd portfolio ---
      await typeCommand(userHost, path1, "cd portfolio");
      await wait(200);

      // --- COMMAND 3: whoami ---
      await typeCommand(userHost, path2, "whoami");
      setLines((prev) => [
        ...prev, 
        { id: "out2", type: "output", text: "liam-hdp" }
      ]);

      await wait(800);

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
        <div id="boot-lines" style={{ fontFamily: "monospace", fontSize: "16px", lineHeight: "1.5" }}>
          {lines.map((l) => (
            <div key={l.id} style={{ marginBottom: "4px" }}>
              {l.type === "command" ? (
                <>
                  {/* Purple User/Host */}
                  <span style={{ color: "#a855f7", fontWeight: "bold" }}>{l.userHost}</span>
                  {/* Blue Directory Path */}
                  <span style={{ color: "#3b82f6", fontWeight: "bold" }}>{l.path}</span>
                  {/* White Typed Command */}
                  <span style={{ color: "#f3f4f6", marginLeft: "8px" }}>{l.text}</span>
                </>
              ) : (
                /* Yellow Output Results */
                <span style={{ color: "#eab308" }}>{l.text}</span>
              )}
            </div>
          ))}
          {/* Keep your existing blinking cursor styling here */}
          <span className="boot-cursor" />
        </div>
      </div>
    </>
  );
}