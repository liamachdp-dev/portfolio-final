"use client";

import { useState } from "react";

const BLOGS_DATA = [
  {
    id: "1",
    title: "OverTheWire Bandit Games (Level 0 to 10)",
    date: "August 10, 2025",
    author: "Liam Hadap",
    snippet: "This will present the processes that allowed me to complete Levels 0–10 in the OverTheWire Bandit Games",
    link: "https://medium.com/@liamashlie.hadap.cics/hadap-activity-1-linux-challenge-a5aadb290097?sharedUserId=liamashlie.hadap.cics",
  },
  {
    id: "2",
    title: "root@rootme:~#: Can you root me?",
    date: "October 18, 2025",
    author: "Liam Hadap",
    snippet: "This is my completion of TryHackMe’s RootMe Activity",
    link: "https://medium.com/@liamashlie.hadap.cics/tryhackme-rootme-activity-ccbe61caac82?sharedUserId=liamashlie.hadap.cics",
  },
//   {
//     id: "3",
//     title: "Bypassing Web Application Firewalls (WAF) via HTTP Parameter Pollution",
//     date: "June 10, 2026",
//     author: "Liam Hadap",
//     snippet: "Exploring parameter parsing quirks in modern web backend framework routers to bypass regex-based WAF signatures.",
//     description: "This writeup explores how different web servers (Express, Flask, ASP.NET) parse duplicate HTTP GET/POST parameters, and how attackers can structure payloads to confuse security proxies while hitting backend endpoints successfully.",
//     link: "https://medium.com/@yourprofile/waf-bypass-hpp",
//   },
//   {
//     id: "4",
//     title: "Linux Privilege Escalation: Exploiting SUID Binaries and Capabilities",
//     date: "May 19, 2026",
//     author: "Liam Hadap",
//     snippet: "Practical methodology for identifying misconfigured SUID flags, GTFOBins exploitation, and elevated POSIX Linux capabilities.",
//     description: "A hands-on guide detailing Linux post-exploitation. Covers searching for custom binaries with SUID bits set, abusing wildcard expansions in cron jobs, and escalating privileges via assigned capabilities like cap_setuid.",
//     link: "https://medium.com/@yourprofile/linux-privesc-suid",
//   },
//   {
//     id: "5",
//     title: "Building Secure CI/CD Pipelines with GitHub Actions & OpenID Connect",
//     date: "April 02, 2026",
//     author: "Liam Hadap",
//     snippet: "Eliminating hardcoded cloud credentials in build runners using short-lived OIDC tokens for AWS and GCP deployments.",
//     description: "A walkthrough on hardening CI/CD workflows. Learn how to configure cloud IAM trust policies to authenticate GitHub Actions jobs directly with cloud providers without storing long-lived access keys in repository secrets.",
//     link: "https://medium.com/@yourprofile/secure-cicd-oidc",
//   },
];

export default function Blogs() {
  const [visibleCount, setVisibleCount] = useState(2);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  return (
    <section id="blogs" className="px-6 sm:px-12 md:px-16 py-12 md:py-14 border-b border-line w-full max-w-[1100px]">
      <span className="block font-mono text-accent text-xs tracking-widest mb-3">
        05 — Writeups
      </span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-[clamp(28px,3vw,40px)] text-ink mb-10">
        Blogs & Writeups
      </h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOGS_DATA.slice(0, visibleCount).map((blog) => (
          <div 
            key={blog.id} 
            className="group flex flex-col justify-between p-6 rounded-xl border border-line bg-paper hover:border-accent hover:shadow-md transition-all duration-300"
          >
            <div>
              {/* Title & Top Right External Link */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="font-display font-semibold text-lg text-ink group-hover:text-accent transition-colors leading-snug">
                  {blog.title}
                </h4>
                <a
                  href={blog.link.startsWith("http") ? blog.link : `https://${blog.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="External link"
                  className="p-1.5 rounded-md border border-line text-inkSoft hover:text-accent hover:border-accent hover:bg-accentSoft transition-all shrink-0 cursor-pointer"
                >
                  <svg className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              </div>

              {/* Snippet */}
              <p className="text-sm text-inkSoft leading-relaxed line-clamp-3 mb-4">
                {blog.snippet}
              </p>
            </div>

            <div>
              {/* Separator Line */}
              <div className="w-full border-b border-line my-4" />

              {/* Author & Date Footer */}
              <div className="flex items-center justify-between text-xs font-mono text-inkSoft tracking-wide">
                <span>Written by <strong className="text-ink font-medium">{blog.author}</strong></span>
                <span>{blog.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < BLOGS_DATA.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            className="font-mono text-xs tracking-widest text-inkSoft uppercase border border-line rounded-full px-5 py-2.5 hover:border-accent hover:text-accent transition-colors cursor-pointer"
          >
            Load 2 more
          </button>
        </div>
      )}
    </section>
  );
}