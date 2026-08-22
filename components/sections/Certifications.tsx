"use client";

import { useState } from "react";

interface Cert {
  title: string;
  issuer: string;
  logo: string; // Path to logo in /public/logos/
  iconBg: string;
  link: string; // Direct verification link
}

interface CertCategory {
  label: string;
  items: Cert[];
}

const categories: CertCategory[] = [
  {
    label: "",
    items: [
      { 
        title: "Certified in Cybersecurity (CC)", 
        issuer: "ISC2", 
        logo: "/logos/isc2-cc.png",
        iconBg: "bg-blue-50",
        link: "https://www.credly.com/badges/96312ce2-7b79-4470-a4f2-a6911f73b635/public_url"
      },
      { 
        title: "IT Fundamentals (ITF+)", 
        issuer: "CompTIA", 
        logo: "/logos/comptia-logo.jpeg",
        iconBg: "bg-red-50",
        link: "" //tbd
      },
      { 
        title: "Azure Fundamentals\n(AZ-900) [In-progress]", //az
        issuer: "Microsoft", 
        logo: "/logos/microsoft-logo.png",
        iconBg: "bg-orange-50",
        link: ""
      },
      { 
        title: "Certified Cloud Practitioner\n [In-progress]", //aws
        issuer: "Amazon Web Services", 
        logo: "/logos/aws-logo.png",
        iconBg: "bg-slate-50",
        link: ""
      },
      { 
        title: "Cloud Infrastructure 2025 Certified Foundations Associate", 
        issuer: "Oracle", 
        logo: "/logos/oracle_logo.jpeg",
        iconBg: "bg-orange-50",
        link: "" //gdrive of cert
      },
      { 
        title: "CCNA: Introduction to Networks", //cisco 1
        issuer: "Cisco", 
        logo: "/logos/cisco1-logo.png",
        iconBg: "bg-purple-50",
        link: "https://www.credly.com/badges/3e533e16-29ae-497f-b08f-cb33b52b3664/public_url"
      },
      { 
        title: "CCNA: Switching, Routing & Wireless Essentials", //cisco 2
        issuer: "Cisco", 
        logo: "/logos/cisco2-logo.png",
        iconBg: "bg-purple-50",
        link: ""
      },
      { 
        title: "CCNA: Enterprise Networking, Security, and Automation", //cisco 3
        issuer: "Cisco", 
        logo: "/logos/cisco3-logo.png",
        iconBg: "bg-purple-50",
        link: "https://www.credly.com/badges/2ba36630-7147-4cf3-8ce7-8cada663f003/public_url"
      },
    ],
  },
];

const ROTATIONS = [-2, 1.5, -1, 2.5, -3, 2, -1.5, 3, -2.5, 1, -2, 2];
const INITIAL_VISIBLE = 4;
const LOAD_STEP = 4;
const MAX_LOADS = 4;

function CertCard({ cert, index }: { cert: Cert; index: number }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      className="group relative bg-white rounded-xl border border-line px-5 py-6 transition-all duration-300 ease-out hover:z-10 hover:scale-105 sm:hover:scale-110 hover:rotate-0 hover:border-accent hover:bg-accentSoft"
      style={{
        transform: `rotate(${rotation}deg)`,
        boxShadow: "0 10px 20px -10px rgba(24,27,23,0.12)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 0 1px rgba(47,93,80,0.3), 0 20px 40px -12px rgba(47,93,80,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 20px -10px rgba(24,27,23,0.12)";
      }}
    >
      <div className={`w-10 h-10 rounded-lg ${cert.iconBg} flex items-center justify-center mb-4 overflow-hidden`}>
        <img 
          src={cert.logo} 
          alt={`${cert.issuer} logo`} 
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-ink font-display font-semibold text-sm leading-snug mb-1 whitespace-pre-line">
        {cert.title}
      </h3>
      <span className="block font-mono text-[10px] tracking-widest text-inkSoft uppercase mb-6">
        {cert.issuer}
      </span>

      <a
        href={cert.link}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[10px] tracking-widest text-inkSoft uppercase group-hover:text-accent transition-colors inline-block cursor-pointer"
      >
        ‹ VERIFY ›
      </a>
    </div>
  );
}

function CategorySection({ category }: { category: CertCategory }) {
  const [loadsUsed, setLoadsUsed] = useState(0);
  const visibleCount = Math.min(INITIAL_VISIBLE + loadsUsed * LOAD_STEP, category.items.length);
  const visible = category.items.slice(0, visibleCount);
  const canLoadMore = loadsUsed < MAX_LOADS && visibleCount < category.items.length;

  return (
    <div className="mb-14">
      {category.label && (
        <span className="block font-mono text-xs tracking-widest text-inkSoft uppercase mb-6">
          {category.label}
        </span>
      )}
      {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 lg:gap-1.5">
        {visible.map((cert, i) => (
          <CertCard key={i} cert={cert} index={i} />
        ))}
      </div>
      {canLoadMore && (
        <button
          onClick={() => setLoadsUsed((n) => n + 1)}
          className="mt-10 font-mono text-xs tracking-widest text-inkSoft uppercase border border-line rounded-full px-5 py-2.5 hover:border-accent hover:text-accent transition-colors cursor-pointer"
        >
          Load 4 more
        </button>
      )}
    </div>
  );
}

export default function Certifications() {
  return (
    <section id="certifications" className="min-h-[70vh] px-6 sm:px-12 md:px-16 py-12 md:py-24 border-b border-line w-full max-w-[1100px]">
      <span className="block font-mono text-accent text-xs tracking-widest  mb-3">02 — Certifications</span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-[clamp(28px,3vw,40px)] text-ink mb-10">Certifications</h2>

      {categories.map((category, index) => (
        <CategorySection key={index} category={category} />
      ))}
    </section>
  );
}