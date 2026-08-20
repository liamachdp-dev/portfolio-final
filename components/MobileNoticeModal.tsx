"use client";

import { useEffect, useState } from "react";

export default function MobileNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show only if not previously dismissed in the current session
    const isDismissed = sessionStorage.getItem("dismiss_mobile_notice");
    if (!isDismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("dismiss_mobile_notice", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[100] bg-ink/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300 font-mono">
      <div className="bg-paper border border-line rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl flex flex-col items-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-accentSoft border border-accent/20 flex items-center justify-center text-accent text-lg font-bold">
          !
        </div>

        {/* Content */}
        <div>
          <h3 className="font-display font-semibold text-ink text-lg mb-1.5">
            Desktop View Recommended
          </h3>
          <p className="text-inkSoft text-xs leading-relaxed">
            For the optimal terminal animation, neofetch layout, and full portfolio experience, viewing on a desktop display is recommended.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDismiss}
          className="w-full mt-2 py-3 px-4 rounded-lg bg-accent text-white text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer font-medium"
        >
          Continue Anyway
        </button>
      </div>
    </div>
  );
}