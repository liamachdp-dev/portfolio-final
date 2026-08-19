"use client";

import { useState } from "react";

export interface GalleryPhoto {
  src?: string; // e.g. "/gallery/photo-1.jpg" once you add real files to public/gallery
  alt: string;
}

const defaultPhotos: GalleryPhoto[] = [
  { src: "/pictures/abt-me2.png", alt: "About me 2" },
  { src: "/pictures/abt-me1.png", alt: "About me 1" },
  { src: "/pictures/abt-me3.png", alt: "About me 3" },
];

export default function PhotoCarousel({ photos = defaultPhotos }: { photos?: GalleryPhoto[] }) {
  const [order, setOrder] = useState<number[]>(photos.map((_, i) => i));

  function next() {
    setOrder((o) => {
      const last = o[o.length - 1];
      return [last, ...o.slice(0, -1)];
    });
  }

  function prev() {
    setOrder((o) => {
      const first = o[0];
      return [...o.slice(1), first];
    });
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[440px] aspect-[3/4]">
        {order.map((photoIndex, p) => {
          const photo = photos[photoIndex];
          const isFront = p === 0;
          const rotate = p === 0 ? 0 : p % 2 === 0 ? -3 : 3;

          return (
            <div
              key={photoIndex}
              className="absolute inset-0 rounded-2xl border border-line bg-accentSoft overflow-hidden transition-all duration-500 ease-out"
              style={{
                transform: `translateY(${p * 14}px) translateX(${p * 6}px) rotate(${rotate}deg) scale(${1 - p * 0.05})`,
                zIndex: order.length - p,
                boxShadow: isFront
                  ? "0 25px 50px -12px rgba(24,27,23,0.35)"
                  : "0 10px 20px -8px rgba(24,27,23,0.15)",
              }}
            >
              {photo.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-accent text-base font-mono">{photo.alt}</span>
                </div>
              )}
            </div>
          );
        })}

        {photos.length > 1 && (
          <>
            <button
              onClick={next}
              aria-label="Previous photo"
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-paper border border-line text-ink text-xl flex items-center justify-center shadow-lg hover:border-accent hover:text-accent transition-colors"
            >
              ‹
            </button>
            <button
              onClick={prev}
              aria-label="Next photo"
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-paper border border-line text-ink text-xl flex items-center justify-center shadow-lg hover:border-accent hover:text-accent transition-colors"
            >
              ›
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                order[0] === i ? "w-5 bg-accent" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}