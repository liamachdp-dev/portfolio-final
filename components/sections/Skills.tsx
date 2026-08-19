"use client";

import { useState } from "react";

interface Category {
  label: string;
  items: string[];
}

// Placeholder data -- edit categories and items freely. Add or remove
// categories entirely; the tabs and layout adapt automatically.
const categories: Category[] = [
  {
    label: "Networking",
    items: ["TCP/IP", "DNS", "Subnetting", "Wireshark", "Nmap", "VPN", "Firewalls", "VLANs"],
  },
  {
    label: "Penetration Testing",
    items: ["Burp Suite", "Metasploit", "Nikto", "SQLmap", "Hydra", "OWASP ZAP", "John the Ripper"],
  },
  {
    label: "Security & Identity",
    items: ["OAuth", "JWT", "LDAP", "AES", "RSA", "SHA", "AWS IAM", "Okta", "GDPR", "SOC 2"],
  },
  {
    label: "Systems & Scripting",
    items: ["Linux", "Bash", "Python", "PowerShell", "Kali Linux", "Docker"],
  },
  {
    label: "DevOps & Cloud",
    items: ["AWS", "GCP", "Azure", "GitHub Actions", "Terraform", "Kubernetes"],
  },
];

export default function Skills() {
  const [active, setActive] = useState(0);

  return (
    <section id="skills" className="px-16 py-14 border-b border-line max-w-[1100px]">
      <span className="block font-mono text-accent text-xs tracking-widest uppercase mb-3">04 — Skills</span>
      <h2 className="font-display font-semibold text-[clamp(28px,3vw,40px)] text-ink mb-10">What I work with</h2>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => setActive(i)}
            className={`font-mono text-xs tracking-widest uppercase px-4 py-2.5 rounded-lg border transition-colors duration-200 ${
              active === i
                ? "border-ink text-ink bg-white"
                : "border-transparent text-inkSoft hover:border-line"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div key={active} className="flex flex-wrap gap-2.5 skills-fade-in">
        {categories[active].items.map((item) => (
          <span
            key={item}
            className="font-mono text-sm text-ink bg-white border border-line rounded-lg px-4 py-2.5 transition-colors duration-200 hover:border-inkSoft"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}