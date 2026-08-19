"use client";

import { useState } from "react";

const SUBMIT_BUFFER_MS = 1400;

export default function RecommendationForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function openModal() {
    setStatus("idle");
    setErrorMsg("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    // The DDOS protection buffer
    await new Promise((resolve) => setTimeout(resolve, SUBMIT_BUFFER_MS));

    const res = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, affiliation, message, company }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error ?? "Something went wrong.");
      return;
    }

    // Success state - we do NOT close the modal here anymore!
    // We let the modal transition to the "Thank You" view.
    setStatus("sent");
    setName("");
    setAffiliation("");
    setMessage("");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center border border-line rounded-2xl px-8 py-12 h-full bg-white transition-all">
        <div className="w-14 h-14 rounded-full bg-accentSoft flex items-center justify-center mb-5">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" className="text-accent" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {status === "sent" ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <p className="font-mono text-sm text-accent mb-1">Submitted!</p>
            <p className="text-inkSoft text-sm max-w-[26ch]">
              Thanks — it&apos;s pending review and will appear here once approved.
            </p>
          </div>
        ) : (
          <>
            <p className="text-ink font-medium mb-5">Want to add?</p>
            <button
              onClick={openModal}
              className="font-mono text-xs tracking-widest uppercase bg-accent text-white px-5 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Add here
            </button>
          </>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity" onClick={closeModal}>
          <div className="bg-white rounded-2xl border border-line shadow-2xl w-full max-w-xl p-9 relative animate-in slide-in-from-bottom-4 fade-in duration-200" onClick={(e) => e.stopPropagation()}>
            
            {status === "sent" ? (
              // --- THE NEW SUCCESS PANEL ---
              <div className="flex flex-col items-center justify-center text-center py-8 animate-in zoom-in-95 fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-accentSoft flex items-center justify-center mb-6">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" className="text-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-3xl text-ink mb-3">Thank you!</h3>
                <p className="text-inkSoft text-base mb-8 max-w-sm mx-auto">
                  Your recommendation was successfully submitted. It is currently pending review and will appear on the site once approved.
                </p>
                <button
                  onClick={closeModal}
                  className="bg-accent text-white font-medium px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
                >
                  Close Window
                </button>
              </div>
            ) : (
              // --- THE ORIGINAL FORM PANEL ---
              <>
                <button onClick={closeModal} aria-label="Close" className="absolute top-5 right-5 text-inkSoft hover:text-ink text-xl leading-none">
                  ×
                </button>

                <h3 className="font-display font-semibold text-2xl text-ink mb-2">Leave a recommendation</h3>
                <p className="text-inkSoft text-sm mb-7">Say a few words -- it'll be reviewed before it shows up publicly.</p>

                <form onSubmit={submit} className="flex flex-col gap-5">
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute -left-[9999px] w-px h-px opacity-0"
                    aria-hidden="true"
                  />

                  <div>
                    <label className="block font-mono text-xs tracking-widest text-inkSoft uppercase mb-2">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={80}
                      placeholder="Your name"
                      className="w-full border border-line rounded-lg px-4 py-3 text-base text-ink focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs tracking-widest text-inkSoft uppercase mb-2">Affiliation to me</label>
                    <input
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      placeholder="e.g. Classmate, Mentor, TryHackMe teammate"
                      maxLength={120}
                      className="w-full border border-line rounded-lg px-4 py-3 text-base text-ink focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs tracking-widest text-inkSoft uppercase mb-2">Recommendation</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      maxLength={800}
                      rows={6}
                      placeholder="Say a few words..."
                      className="w-full border border-line rounded-lg px-4 py-3 text-base text-ink resize-none focus:outline-none focus:border-accent"
                    />
                  </div>

                  {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="bg-accent text-white text-sm font-medium px-6 py-3.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}