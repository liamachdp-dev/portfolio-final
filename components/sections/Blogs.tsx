"use client";

import { useState, useEffect } from "react";

const BLOGS_DATA = [
  {
    id: "1",
    title: "TryHackMe: Exploiting Misconfigured Active Directory Kerberos",
    date: "August 14, 2026",
    author: "Liam Hadap",
    snippet: "A deep dive walk-through covering Kerberoasting, AS-REP Roasting, and practical escalation strategies in an active directory environment.",
    description: "In this writeup, we analyze active directory vulnerabilities within Kerberos authentication. We walk through initial enumeration using BloodHound, executing AS-REP Roasting against accounts without pre-authentication, and leveraging Kerberoasting to extract service account ticket hashes for offline cracking.",
    link: "https://medium.com/@yourprofile/kerberos-exploitation",
  },
  {
    id: "2",
    title: "Understanding AWS S3 Bucket Privilege Escalation & Misconfigurations",
    date: "July 28, 2026",
    author: "Liam Hadap",
    snippet: "Analyzing common cloud access vector issues, public bucket leaks, and enforcing least privilege policies across IAM roles.",
    description: "Cloud misconfigurations remain one of the top security risks for modern enterprises. This writeup covers common S3 bucket policies that lead to unauthorized read/write permissions, role assumption vectors, and how to configure IAM policies properly using AWS CLI and Terraform.",
    link: "https://medium.com/@yourprofile/aws-s3-security",
  },
  {
    id: "3",
    title: "Bypassing Web Application Firewalls (WAF) via HTTP Parameter Pollution",
    date: "June 10, 2026",
    author: "Liam Hadap",
    snippet: "Exploring parameter parsing quirks in modern web backend framework routers to bypass regex-based WAF signatures.",
    description: "This writeup explores how different web servers (Express, Flask, ASP.NET) parse duplicate HTTP GET/POST parameters, and how attackers can structure payloads to confuse security proxies while hitting backend endpoints successfully.",
    link: "https://medium.com/@yourprofile/waf-bypass-hpp",
  },
  {
    id: "4",
    title: "Linux Privilege Escalation: Exploiting SUID Binaries and Capabilities",
    date: "May 19, 2026",
    author: "Liam Hadap",
    snippet: "Practical methodology for identifying misconfigured SUID flags, GTFOBins exploitation, and elevated POSIX Linux capabilities.",
    description: "A hands-on guide detailing Linux post-exploitation. Covers searching for custom binaries with SUID bits set, abusing wildcard expansions in cron jobs, and escalating privileges via assigned capabilities like cap_setuid.",
    link: "https://medium.com/@yourprofile/linux-privesc-suid",
  },
  {
    id: "5",
    title: "Building Secure CI/CD Pipelines with GitHub Actions & OpenID Connect",
    date: "April 02, 2026",
    author: "Liam Hadap",
    snippet: "Eliminating hardcoded cloud credentials in build runners using short-lived OIDC tokens for AWS and GCP deployments.",
    description: "A walkthrough on hardening CI/CD workflows. Learn how to configure cloud IAM trust policies to authenticate GitHub Actions jobs directly with cloud providers without storing long-lived access keys in repository secrets.",
    link: "https://medium.com/@yourprofile/secure-cicd-oidc",
  },
];

type Blog = typeof BLOGS_DATA[0];

export default function Blogs() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [visibleCount, setVisibleCount] = useState(2);

  // Disables background scrolling when the modal is open
  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedBlog]);

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
            className="group cursor-pointer flex flex-col justify-between p-6 rounded-xl border border-line bg-paper hover:border-accent hover:shadow-md transition-all duration-300"
            onClick={() => setSelectedBlog(blog)}
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
                  onClick={(e) => e.stopPropagation()}
                  aria-label="External link"
                  className="p-1.5 rounded-md border border-line text-inkSoft hover:text-accent hover:border-accent hover:bg-accentSoft transition-all shrink-0"
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

      {/* Load More Button copied directly from Certifications */}
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

      {/* Text-Focused Modal */}
      {selectedBlog && (
        <div 
          className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
          onClick={() => setSelectedBlog(null)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] p-6 sm:p-8 md:p-10 flex flex-col overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-line/20 border border-line rounded-full flex items-center justify-center text-inkSoft hover:text-ink hover:bg-line/40 transition-all cursor-pointer text-lg"
              aria-label="Close modal"
            >
              ×
            </button>

            <p className="font-mono text-xs tracking-widest text-inkSoft mb-3 uppercase">
              {selectedBlog.date} — Written by {selectedBlog.author}
            </p>
            
            <div className="flex items-start justify-between gap-4 mb-6 pr-8">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-tight">
                {selectedBlog.title}
              </h3>
              <a 
                href={selectedBlog.link.startsWith("http") ? selectedBlog.link : `https://${selectedBlog.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-ink transition-colors p-1 shrink-0"
                aria-label="Visit full writeup"
                title="Visit full writeup"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="w-full border-b border-line mb-6" />

            <p className="text-sm sm:text-base text-inkSoft leading-relaxed whitespace-pre-line">
              {selectedBlog.description}
            </p>

            <div className="mt-8 pt-6 border-t border-line flex justify-end">
              <a 
                href={selectedBlog.link.startsWith("http") ? selectedBlog.link : `https://${selectedBlog.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-widest bg-accent text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Read Full Article →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}