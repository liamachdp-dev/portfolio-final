"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import Neofetch from "@/components/Neofetch";

// This is a Client Component (it needs useState for the boot
// animation), but `children` below is rendered by the Server
// Component that uses it (app/page.tsx) and passed in already-built --
// so sections like Recommendations can stay server components and
// still read cookies/Supabase safely, even though they render
// underneath this client boundary.
export default function PageShell({ children }: { children: React.ReactNode }) {
  const [bootDone, setBootDone] = useState(false);

  return (
    <>
      <BootSequence onDone={() => setBootDone(true)} />
      <Neofetch start={bootDone} />
      <div 
        id="modern" 
        className="bg-paper text-ink font-sans flex flex-col md:flex-row min-h-screen overflow-x-hidden pt-14 md:pt-0"
      >
        {children}
      </div>
    </>
  );
}